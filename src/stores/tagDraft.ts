import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import type { QAItem } from '@/types/models'

export const useTagDraftStore = defineStore('tag-draft', () => {
  const state = reactive({ tag: '', answers: [] as QAItem[], expiry: '本周', meeting: '都可以', city: '' })
  const isDirty = computed(() => Boolean(state.tag || state.answers.some(item => item.answer)))

  function patch(payload: Partial<typeof state>) { Object.assign(state, payload) }
  function clear() { Object.assign(state, { tag: '', answers: [], expiry: '本周', meeting: '都可以', city: '' }) }

  return { state, isDirty, patch, clear }
}, {
  persist: {
    storage: {
      getItem: key => uni.getStorageSync(key) || null,
      setItem: (key, value) => uni.setStorageSync(key, value),
    },
  },
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useTagDraftStore, import.meta.hot))
