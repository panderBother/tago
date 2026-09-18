import { computed, reactive, readonly, shallowRef } from 'vue'
import { getProfile, updateProfile } from '@/api/account'
import { getSession, login, recoverLogin, register, requestPasswordResetCode, requestRegistrationCode, resetPassword } from '@/api/auth'
import { ApiError } from '@/api/client'
import { useUserStore } from '@/stores/user'

type Mode = 'register' | 'reset'

export function useAuthFlow(mode?: Mode) {
  const userStore = useUserStore()
  const form = reactive({ email: '', password: '', confirmPassword: '', code: '', nickname: '' })
  const challengeId = shallowRef('')
  const retryAfter = shallowRef(0)
  const submitting = shallowRef(false)
  const message = shallowRef('')
  const error = shallowRef('')
  const recoveryRequestId = shallowRef('')

  const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
  const passwordValid = computed(() => Array.from(form.password).length >= 8)
  const passwordMatches = computed(() => !form.confirmPassword || form.password === form.confirmPassword)
  const canRequestCode = computed(() => emailValid.value && retryAfter.value <= 0 && !submitting.value)
  const canVerify = computed(() => Boolean(challengeId.value && /^\d{6}$/.test(form.code.trim()) && passwordValid.value && passwordMatches.value))

  function beginCountdown(seconds: number) {
    retryAfter.value = seconds
    const timer = setInterval(() => {
      retryAfter.value -= 1
      if (retryAfter.value <= 0) clearInterval(timer)
    }, 1000)
  }

  async function run<T>(task: () => Promise<T>) {
    submitting.value = true
    error.value = ''
    message.value = ''
    try { return await task() }
    catch (cause) {
      error.value = cause instanceof Error ? cause.message : '请求没有完成，请稍后再试'
      throw cause
    }
    finally { submitting.value = false }
  }

  async function signIn() {
    if (!emailValid.value || !passwordValid.value) {
      error.value = '请输入有效邮箱和至少 8 位密码'
      return false
    }
    return run(async () => {
      const session = await login({ email: form.email.trim(), password: form.password })
      userStore.setSession(session)
      return true
    }).catch((cause) => {
      if (cause instanceof ApiError && cause.code === 'LOGIN_CAPACITY_EXCEEDED') {
        const details = cause.details as { recoveryRequestId?: string } | undefined
        recoveryRequestId.value = details?.recoveryRequestId || ''
        error.value = '当前账号登录设备已满，请在其他设备退出后重试。'
      }
      return false
    })
  }

  async function recover() {
    if (!recoveryRequestId.value) return false
    return run(async () => {
      const session = await recoverLogin({ email:form.email.trim(), password:form.password, recoveryRequestId:recoveryRequestId.value, confirm:true })
      userStore.setSession(session)
      recoveryRequestId.value = ''
      return true
    }).catch(() => false)
  }

  async function requestCode() {
    if (!mode || !canRequestCode.value) return false
    return run(async () => {
      const result = mode === 'register'
        ? await requestRegistrationCode({ email: form.email.trim() })
        : await requestPasswordResetCode({ email: form.email.trim() })
      challengeId.value = result.challengeId
      beginCountdown(result.retryAfterSeconds)
      message.value = `验证码已发送，有效期 ${Math.ceil(result.expiresInSeconds / 60)} 分钟`
      return true
    }).catch(() => false)
  }

  async function verify() {
    if (!mode || !canVerify.value) {
      error.value = '请填写 6 位验证码，并确认两次密码一致'
      return false
    }
    return run(async () => {
      const payload = { challengeId: challengeId.value, code: form.code.trim(), email: form.email.trim(), password: form.password }
      if (mode === 'reset') {
        await resetPassword(payload)
        message.value = '密码已重置，请使用新密码登录'
        return true
      }

      const result = await register(payload)
      if (!result.authenticated) return true
      const session = await getSession()
      userStore.setSession(session)
      if (form.nickname.trim()) {
        const profile = await getProfile()
        await updateProfile({ displayName: form.nickname.trim(), avatarId: profile.avatarId, expectedVersion: profile.version })
      }
      return true
    }).catch(() => false)
  }

  return {
    form,
    challengeId: readonly(challengeId),
    retryAfter: readonly(retryAfter),
    submitting: readonly(submitting),
    message: readonly(message),
    error: readonly(error),
    recoveryRequestId: readonly(recoveryRequestId),
    emailValid,
    passwordValid,
    passwordMatches,
    canRequestCode,
    canVerify,
    signIn,
    recover,
    requestCode,
    verify,
  }
}
