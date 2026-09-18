import type { components } from './types/generated'
import { request } from './client'

export function getWalletBalance() {
  return request<components['schemas']['WalletBalance']>({ path: '/v1/wallet' })
}

export function listWalletEntries(query: { beforeSequence?: number; limit?: number } = {}) {
  return request<components['schemas']['WalletEntry'][]>({ path: '/v1/wallet/entries', query })
}
