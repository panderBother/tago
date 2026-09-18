import type { components } from './types/generated'
import { request } from './client'

export type ChatConnectionDto = components['schemas']['ChatConnection']
export type ConversationPageDto = components['schemas']['ConversationPage']
export type ConversationViewDto = components['schemas']['ConversationView']
export type ConversationDetailDto = components['schemas']['ConversationDetailView']
export type EncounterPageDto = components['schemas']['EncounterPage']
export type EncounterDetailDto = components['schemas']['EncounterDetailView']
export type ChatPolicyDto = components['schemas']['PolicyView']

export function listChats(query: { limit?: number; cursor?: string } = {}) {
  return request<ConversationPageDto>({ path: '/v1/chats', query })
}

export function createChatConnection() {
  return request<ChatConnectionDto>({ path: '/v1/chats/connection', method: 'POST' })
}

export function getChatPolicy() {
  return request<ChatPolicyDto>({ path: '/v1/chats/policy' })
}

export function acceptChatPolicy() {
  return request<ChatPolicyDto>({ path: '/v1/chats/policy/accept', method: 'POST' })
}

export function resolveChatPeers(peerHandles: string[]) {
  return request<ConversationViewDto[], components['schemas']['ResolveInput']>({
    path: '/v1/chats/resolve',
    method: 'POST',
    body: { peerHandles },
  })
}

export function getChatDetail(conversationId: string, options: { silent?: boolean } = {}) {
  return request<ConversationDetailDto>({
    path: `/v1/chats/${conversationId}`,
    silent: options.silent,
  })
}

export function createConversationConnection(conversationId: string) {
  return request<components['schemas']['ChatConversationConnection']>({
    path: `/v1/chats/${conversationId}/connection`,
    method: 'POST',
  })
}

export function listEncounters(conversationId: string, query: { limit?: number; cursor?: string } = {}) {
  return request<EncounterPageDto>({ path: `/v1/chats/${conversationId}/encounters`, query })
}

export function getEncounterDetail(conversationId: string, encounterId: string) {
  return request<EncounterDetailDto>({ path: `/v1/chats/${conversationId}/encounters/${encounterId}` })
}
