<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { shallowRef } from 'vue'
import AuthField from '@/components/auth/AuthField.vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import { useAuthFlow } from '@/composables/useAuthFlow'

const redirect = shallowRef('/pages/discover/index')
const { form, submitting, error, recoveryRequestId, signIn, recover } = useAuthFlow()

async function submit() {
  if (await signIn()) uni.reLaunch({ url: redirect.value })
}
async function confirmRecovery() { if (await recover()) uni.reLaunch({ url:redirect.value }) }
function openRegister() { uni.navigateTo({ url: '/pages/auth/register' }) }
function openReset() { uni.navigateTo({ url: '/pages/auth/reset' }) }

onLoad((query) => {
  if (typeof query?.redirect === 'string' && query.redirect.startsWith('/pages/')) redirect.value = decodeURIComponent(query.redirect)
})
</script>

<template>
  <AuthShell title="欢迎回来" subtitle="继续遇见同频的人">
    <form @submit="submit">
      <AuthField v-model="form.email" label="邮箱" placeholder="请输入邮箱" />
      <AuthField v-model="form.password" label="密码" type="password" placeholder="请输入密码" />
      <view class="auth-row"><button type="button" @click="openReset">忘记密码？</button></view>
      <text v-if="error" class="auth-message auth-message--error">{{ error }}</text>
      <button v-if="recoveryRequestId" class="auth-recover" type="button" @click="confirmRecovery">撤销其他登录并继续</button>
      <button class="auth-submit" :loading="submitting" :disabled="submitting" form-type="submit">登录</button>
      <button class="auth-link" type="button" @click="openRegister">还没有账号？<b>去注册</b></button>
    </form>
  </AuthShell>
</template>

<style scoped lang="scss">
.auth-row { display:flex; justify-content:flex-end; margin-top:-8rpx; }.auth-row button,.auth-link { padding:0; color:var(--tago-muted); border:0; background:transparent; font-size:22rpx; }.auth-row button::after,.auth-link::after { border:0; }
.auth-submit { height:86rpx; margin-top:24rpx; color:#fff; border-radius:999rpx; background:var(--tago-primary); font-size:30rpx; font-weight:800; line-height:86rpx; }.auth-submit[disabled]{ opacity:.58; }
.auth-link { display:block; margin:22rpx auto 0; }.auth-link b { color:var(--tago-primary); font-weight:850; }
.auth-message { display:block; margin:16rpx 4rpx 0; font-size:21rpx; line-height:1.5; }.auth-message--error { color:var(--tago-danger); }
.auth-recover { height:66rpx; margin-top:15rpx; color:var(--tago-danger); border:1px solid var(--tago-danger); border-radius:999rpx; background:transparent; font-size:21rpx; line-height:64rpx; }.auth-recover::after{border:0}
</style>
