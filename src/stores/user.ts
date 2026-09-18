import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'
import type { components } from '@/api/types/generated'

type SessionView = components['schemas']['SessionView']

export const useUserStore = defineStore('user', () => {
  const session = shallowRef<SessionView | null>(null)
  const isAuthenticated = computed(() => Boolean(session.value?.authenticated))

  function setSession(value: SessionView | null) { session.value = value }
  function clear() { session.value = null }

  return { session, isAuthenticated, setSession, clear }
}, { persist: true })

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
