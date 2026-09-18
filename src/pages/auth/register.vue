<script setup lang="ts">
import AuthField from '@/components/auth/AuthField.vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import { useAuthFlow } from '@/composables/useAuthFlow'

const { form, challengeId, retryAfter, submitting, error, message, passwordMatches, requestCode, verify } = useAuthFlow('register')
function goBack() { uni.navigateBack() }
function openLogin() { uni.redirectTo({ url:'/pages/auth/login' }) }
async function submit() {
  if (await verify()) uni.reLaunch({ url:'/pages/discover/index' })
}
</script>

<template>
  <AuthShell back title="第一次见面" subtitle="写下你的名字，开始遇见同频的人" @back="goBack">
    <form @submit="submit">
      <AuthField v-model="form.nickname" label="昵称" placeholder="怎么称呼你" :maxlength="24" />
      <AuthField v-model="form.email" label="邮箱" placeholder="请输入邮箱" />
      <view class="code-line">
        <AuthField v-model="form.code" label="验证码" type="number" placeholder="6 位验证码" :maxlength="6" />
        <button type="button" :disabled="submitting || retryAfter > 0" @click="requestCode">{{ retryAfter > 0 ? `${retryAfter}s` : challengeId ? '重新发送' : '发送验证码' }}</button>
      </view>
      <AuthField v-model="form.password" label="密码" type="password" placeholder="至少 8 位密码" />
      <AuthField v-model="form.confirmPassword" label="确认密码" type="password" placeholder="再次输入密码" :error="passwordMatches ? '' : '两次输入的密码不一致'" />
      <text v-if="message" class="auth-message">{{ message }}</text>
      <text v-if="error" class="auth-message auth-message--error">{{ error }}</text>
      <button class="auth-submit" :loading="submitting" :disabled="submitting" form-type="submit">创建账号</button>
      <button class="auth-link" type="button" @click="openLogin">已有账号？<b>去登录</b></button>
    </form>
  </AuthShell>
</template>

<style scoped lang="scss">
.code-line { position:relative; }.code-line :deep(.field__input){ padding-right:128px; }.code-line>button { position:absolute; right:10px; bottom:4px; height:36px; padding:0 16px; color:var(--tago-primary); border-radius:999rpx; background:var(--tago-note-yellow); font-size:14px; line-height:36px; }.code-line>button::after{border:0}.code-line>button[disabled]{opacity:.55}
.auth-submit { height:86rpx; margin-top:24rpx; color:#fff; border-radius:999rpx; background:var(--tago-primary); font-size:30rpx; font-weight:800; line-height:86rpx; }.auth-submit[disabled]{ opacity:.58; }
.auth-link { display:block; margin:22rpx auto 0; padding:0; color:var(--tago-muted); border:0; background:transparent; font-size:22rpx; }.auth-link::after{border:0}.auth-link b { color:var(--tago-primary); font-weight:850; }
.auth-message { display:block; margin:12rpx 4rpx 0; color:var(--tago-primary); font-size:21rpx; line-height:1.5; }.auth-message--error { color:var(--tago-danger); }
</style>
