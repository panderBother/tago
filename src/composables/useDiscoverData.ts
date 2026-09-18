import { computed, shallowRef } from 'vue'
import { getCurrentExposure } from '@/api/exposure'
import { recommendationToTag, tagDtoToTag } from '@/api/adapters'
import { getDiscovery, getMyTag, getPublicTag, refreshDiscovery } from '@/api/social'
import type { TagItem } from '@/types/models'
import { ensureBackendSession } from './useBackendSession'

export function useDiscoverData() {
  const tags = shallowRef<TagItem[]>([])
  const featuredTag = shallowRef<TagItem | null>(null)
  const currentTag = shallowRef<string>('')
  const loading = shallowRef(false)
  const error = shallowRef('')

  async function load() {
    if (loading.value) return
    loading.value = true
    error.value = ''
    try {
      await ensureBackendSession()
      const [discovery, mine, exposure] = await Promise.all([
        getDiscovery(),
        getMyTag(),
        getCurrentExposure().catch(() => null),
      ])

      const recommended = discovery.items.map((item, index) => recommendationToTag(item, index, discovery.generatedAt))

      const mineTag = mine.draft || mine.active
      currentTag.value = mineTag?.body || ''

      if (exposure?.tagId) {
        const topTag = await getPublicTag(exposure.tagId)
        featuredTag.value = { ...tagDtoToTag(topTag), price: Number(exposure.paidCoin) || undefined }
      }
      else if (recommended.length) {
        featuredTag.value = recommended[0]!
      }

      // 置顶 Tag 不在推荐流里重复出现
      const featuredId = featuredTag.value?.id
      tags.value = recommended.filter(item => item.id !== featuredId)
    }
    catch (cause) {
      tags.value = []
      featuredTag.value = null
      error.value = cause instanceof Error ? cause.message : '发现内容加载失败'
    }
    finally {
      loading.value = false
    }
  }

  async function refresh() {
    loading.value = true
    error.value = ''
    try {
      await ensureBackendSession()
      const discovery = await refreshDiscovery()
      const featuredId = featuredTag.value?.id
      tags.value = discovery.items
        .filter(item => !featuredId || item.tagId !== featuredId)
        .map((item, index) => recommendationToTag(item, index, discovery.generatedAt))
    }
    catch (cause) { error.value = cause instanceof Error ? cause.message : '刷新失败' }
    finally { loading.value = false }
  }

  return {
    tags: computed(() => tags.value),
    featuredTag: computed(() => featuredTag.value),
    currentTag: computed(() => currentTag.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    load,
    refresh,
  }
}
