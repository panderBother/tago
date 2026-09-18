import { readonly, shallowRef } from 'vue'

export function useAsyncTask<TResult>() {
  const loading = shallowRef(false)
  const error = shallowRef<Error | null>(null)
  const result = shallowRef<TResult | null>(null)
  let taskId = 0

  async function run(task: () => Promise<TResult>) {
    const currentTask = ++taskId
    loading.value = true
    error.value = null
    try {
      const value = await task()
      if (currentTask === taskId) result.value = value
      return value
    } catch (reason) {
      if (currentTask === taskId) error.value = reason instanceof Error ? reason : new Error(String(reason))
      throw reason
    } finally {
      if (currentTask === taskId) loading.value = false
    }
  }

  function cancel() { taskId += 1; loading.value = false }

  return { loading: readonly(loading), error: readonly(error), result: readonly(result), run, cancel }
}
