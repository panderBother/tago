import { computed, shallowRef } from 'vue'
import { conversationDtoToItem } from '@/api/adapters'
import { getChatDetail, listChats, resolveChatPeers } from '@/api/chat'
import { listApplications } from '@/api/social'
import { FIXTURES_ENABLED } from '@/api/client'
import { conversationRowMeta } from '@/mocks/fixtures'
import type { ConversationItem } from '@/types/models'
import { ensureBackendSession } from './useBackendSession'

/** 从相遇摘要里提取 Tag 名：'在「想找会修老相机的师傅」的 Tag 下相遇…' → '想找会修老相机的师傅' */
function reasonTagFromSummary(summary?: string | null): string | null {
  const matched = summary?.match(/「(.+?)」/)
  return matched?.[1] ?? null
}

export function useMeetData() {
  const conversations = shallowRef<ConversationItem[]>([])
  const pendingCount = shallowRef(0)
  const loading = shallowRef(false)
  const error = shallowRef('')

  async function load() {
    if (loading.value) return
    loading.value = true
    error.value = ''
    try {
      await ensureBackendSession()
      const page = await listChats({ limit: 30 })
      const handles = page.items.map(item => item.peerTinodeUserId).filter((value): value is string => Boolean(value))
      const resolved = handles.length ? await resolveChatPeers(handles) : page.items
      const sourceItems = resolved.length ? resolved : page.items
      // 逐个取会话详情，用相遇快照还原「因为 #xx 而认识」的真实缘由
      const items = await Promise.all(sourceItems.map(async (item, index) => {
        let reasonTag: string | null = null
        try {
          const detail = await getChatDetail(item.id, { silent: true })
          const encounters = [detail.firstEncounter, detail.latestEncounter]
          reasonTag = encounters.map(encounter => reasonTagFromSummary(encounter?.summary)).find(Boolean) ?? null
        }
        catch {
          reasonTag = null
        }
        const meta = FIXTURES_ENABLED ? conversationRowMeta[item.id] : undefined
        return conversationDtoToItem(item, index, { meta, reasonTag })
      }))
      conversations.value = items
      const applications = await listApplications({ state: 'PENDING', limit: 30 })
      pendingCount.value = applications.items.length
    }
    catch (cause) {
      conversations.value = []
      error.value = cause instanceof Error ? cause.message : '会话列表加载失败'
    }
    finally {
      loading.value = false
    }
  }

  return {
    conversations: computed(() => conversations.value),
    pendingCount: computed(() => pendingCount.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    load,
  }
}
