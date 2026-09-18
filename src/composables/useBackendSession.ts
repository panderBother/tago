import { getSession } from '@/api/auth'
import { ApiError } from '@/api/client'
import { useUserStore } from '@/stores/user'

let sessionTask: ReturnType<typeof getSession> | null = null

export async function ensureBackendSession() {
  const userStore = useUserStore()
  if (userStore.isAuthenticated && userStore.session) return userStore.session
  if (sessionTask) return sessionTask

  sessionTask = (async () => {
    const existing = await getSession()
    if (existing.authenticated) {
      userStore.setSession(existing)
      return existing
    }

    userStore.clear()
    throw new ApiError('请先登录 TAGO', 'AUTHENTICATION_REQUIRED', 401)
  })()

  try {
    return await sessionTask
  }
  finally {
    sessionTask = null
  }
}
