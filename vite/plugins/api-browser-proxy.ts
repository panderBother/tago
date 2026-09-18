import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

interface ChromeTarget {
  id: string
  type: string
  url: string
  webSocketDebuggerUrl: string
}

interface BrowserFetchResult {
  status: number
  statusText: string
  headers: Array<[string, string]>
  body: string
}

interface ApiBrowserProxyOptions {
  cdpUrl: string
  upstreamOrigin: string
}

const ignoredRequestHeaders = new Set([
  'connection',
  'content-length',
  'cookie',
  'host',
  'origin',
  'referer',
])

const ignoredResponseHeaders = new Set([
  'content-encoding',
  'content-length',
  'transfer-encoding',
])

function readRequestBody(request: IncomingMessage): Promise<Buffer | undefined> {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return Promise.resolve(undefined)
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    request.on('data', chunk => chunks.push(Buffer.from(chunk)))
    request.on('end', () => resolve(Buffer.concat(chunks)))
    request.on('error', reject)
  })
}

function createHeaderRecord(request: IncomingMessage): Record<string, string> {
  const headers: Record<string, string> = {}
  for (const [name, value] of Object.entries(request.headers)) {
    if (ignoredRequestHeaders.has(name.toLowerCase())) continue
    if (typeof value === 'string') headers[name] = value
    else if (Array.isArray(value) && value.length > 0) headers[name] = value.join(', ')
  }
  return headers
}

async function getOrCreateApiTarget({ cdpUrl, upstreamOrigin }: ApiBrowserProxyOptions): Promise<ChromeTarget> {
  const listResponse = await fetch(`${cdpUrl}/json/list`)
  if (!listResponse.ok) throw new Error(`Chrome CDP endpoint unavailable: ${listResponse.status}`)

  const targets = await listResponse.json() as ChromeTarget[]
  const existing = targets.find(target => target.type === 'page' && target.url.startsWith(upstreamOrigin))
  if (existing) return existing

  const createdResponse = await fetch(`${cdpUrl}/json/new?${encodeURIComponent(upstreamOrigin)}`, { method: 'PUT' })
  if (!createdResponse.ok) throw new Error(`Unable to create Chrome API page: ${createdResponse.status}`)
  return await createdResponse.json() as ChromeTarget
}

function connectChrome(target: ChromeTarget) {
  return new Promise<{ send: (method: string, params?: Record<string, unknown>) => Promise<any>; close: () => void }>((resolve, reject) => {
    const socket = new WebSocket(target.webSocketDebuggerUrl)
    let sequence = 0
    const pending = new Map<number, (message: any) => void>()

    socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data))
      if (message.id && pending.has(message.id)) {
        pending.get(message.id)?.(message)
        pending.delete(message.id)
      }
    })
    socket.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          const id = ++sequence
          socket.send(JSON.stringify({ id, method, params }))
          return new Promise(resolveMessage => pending.set(id, resolveMessage))
        },
        close: () => socket.close(),
      })
    })
    socket.addEventListener('error', () => reject(new Error('Unable to connect to Chrome CDP WebSocket')))
  })
}

async function evaluateInChrome(target: ChromeTarget, expression: string): Promise<any> {
  const chrome = await connectChrome(target)
  try {
    const response = await chrome.send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression,
    })
    if (response.error) throw new Error(JSON.stringify(response.error))
    if (response.result?.exceptionDetails) {
      throw new Error(JSON.stringify(response.result.exceptionDetails))
    }
    return response.result?.result?.value
  }
  finally {
    chrome.close()
  }
}

async function forwardThroughBrowser(request: IncomingMessage, options: ApiBrowserProxyOptions): Promise<BrowserFetchResult> {
  const body = await readRequestBody(request)
  const target = await getOrCreateApiTarget(options)
  const isTinodeTransport = Boolean(request.url?.startsWith('/api/v0/channels'))
  const requestUrl = options.upstreamOrigin.replace(/\/$/, '')
    + (isTinodeTransport ? request.url?.replace(/^\/api(?=\/)/, '') : request.url)
  const headers = createHeaderRecord(request)

  if (isTinodeTransport) {
    const csrfUrl = `${options.upstreamOrigin.replace(/\/$/, '')}/api/v1/auth/csrf`
    const csrf = await evaluateInChrome(target, `
      (async () => {
        const response = await fetch(${JSON.stringify(csrfUrl)}, { credentials: 'include' })
        const payload = await response.json()
        return payload?.data
      })()
    `)
    if (csrf?.headerName && csrf?.token) headers[csrf.headerName] = csrf.token
  }

  const payload = JSON.stringify({
    url: requestUrl,
    method: request.method || 'GET',
    headers,
    body: body?.toString('base64'),
  })

  const result = await evaluateInChrome(target, `
    (async () => {
      const request = ${payload}
      const body = request.body
        ? Uint8Array.from(atob(request.body), character => character.charCodeAt(0))
        : undefined
      const response = await fetch(request.url, {
        method: request.method,
        credentials: 'include',
        headers: request.headers,
        body,
      })
      return {
        status: response.status,
        statusText: response.statusText,
        headers: Array.from(response.headers.entries()),
        body: await response.text(),
      }
    })()
  `)

  if (!result) throw new Error('Chrome returned an empty API response')
  return result
}

export function apiBrowserProxyPlugin(options: ApiBrowserProxyOptions): Plugin {
  return {
    name: 'tago-api-browser-proxy',
    configureServer(server) {
      server.middlewares.use(async (request: IncomingMessage, response: ServerResponse, next: (error?: unknown) => void) => {
        if (!request.url?.startsWith('/api')) {
          next()
          return
        }

        try {
          const result = await forwardThroughBrowser(request, options)
          response.statusCode = result.status
          for (const [name, value] of result.headers) {
            if (!ignoredResponseHeaders.has(name.toLowerCase())) response.setHeader(name, value)
          }
          response.end(result.body)
        }
        catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          console.error(`[tago-api-browser-proxy] ${message}`)
          if (!response.headersSent) {
            response.statusCode = 502
            response.setHeader('content-type', 'application/json; charset=utf-8')
          }
          response.end(JSON.stringify({
            errCode: 'LOCAL_PROXY_ERROR',
            errMessage: message,
            success: false,
          }))
        }
      })
    },
  }
}
