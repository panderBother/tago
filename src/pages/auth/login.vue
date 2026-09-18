<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { shallowRef } from 'vue'
import AuthSpot from '@/components/auth/AuthSpot.vue'
import AuthStage from '@/components/auth/AuthStage.vue'
import { LOGIN_LAYOUT } from '@/components/auth/authLayout'
import { useAuthFlow } from '@/composables/useAuthFlow'
import loginBackground from '@/static/auth/login-bg.jpg'

const redirect = shallowRef('/pages/discover/index')
const layout = LOGIN_LAYOUT
const debug = shallowRef(false)
const { form, submitting, error, recoveryRequestId, signIn, recover } = useAuthFlow()

async function submit() {
  if (await signIn()) uni.reLaunch({ url: redirect.value })
}
async function confirmRecovery() {
  if (await recover()) uni.reLaunch({ url: redirect.value })
}
function openRegister() { uni.navigateTo({ url: '/pages/auth/register' }) }
function openReset() { uni.navigateTo({ url: '/pages/auth/reset' }) }

onLoad((query) => {
  if (query?.debug === '1') debug.value = true
  if (typeof query?.redirect === 'string' && query.redirect.startsWith('/pages/')) redirect.value = decodeURIComponent(query.redirect)
})
</script>

<template>
  <form class="auth" @submit="submit">
    <AuthStage :image="loginBackground" :debug="debug">
      <AuthSpot :spot="layout.tabRegister" label="tab-register">
        <button class="tap" hover-class="tap--pressed" type="button" @click="openRegister" />
      </AuthSpot>

      <AuthSpot :spot="layout.email" label="email">
        <input
          v-model="form.email"
          class="ink"
          type="text"
          placeholder="请输入邮箱"
          placeholder-class="ink-placeholder"
        />
      </AuthSpot>

      <AuthSpot :spot="layout.password" label="password">
        <input
          v-model="form.password"
          class="ink"
          type="text"
          password
          placeholder="请输入密码"
          placeholder-class="ink-placeholder"
        />
      </AuthSpot>

      <AuthSpot :spot="layout.forgot" label="forgot">
        <button class="tap" hover-class="tap--pressed" type="button" @click="openReset" />
      </AuthSpot>

      <AuthSpot v-if="layout.submit" :spot="layout.submit" label="submit">
        <button class="tap" hover-class="tap--pressed" :loading="submitting" :disabled="submitting" form-type="submit" />
      </AuthSpot>

      <AuthSpot v-if="recoveryRequestId" :spot="layout.message" label="recover">
        <button class="recover" type="button" @click="confirmRecovery">当前账号登录设备已满，点此撤销其他登录并继续</button>
      </AuthSpot>
      <AuthSpot v-else :spot="layout.message" label="message">
        <text class="message message--error">{{ error }}</text>
      </AuthSpot>
    </AuthStage>
  </form>
</template>

<style scoped lang="scss">
.auth { display: block; width: 100%; }

/* Invisible hit areas sitting on top of the mockup artwork. */
.tap {
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: 999rpx;
  background: transparent;
  transition: background-color .12s ease;
}

.tap--pressed { background: rgba(36, 40, 32, .13); }

/* Real text drawn where the mockup placeholder used to be. */
.ink {
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--tago-ink);
  caret-color: var(--tago-primary);
  font-family: inherit;
  font-size: 34rpx;
}

.message {
  display: block;
  width: 100%;
  color: var(--tago-primary);
  font-size: 24rpx;
  line-height: 1.4;
  text-align: center;
}

.message--error { color: var(--tago-danger); }

.recover {
  width: 100%;
  height: 100%;
  padding: 0 10rpx;
  color: var(--tago-danger);
  border: 1rpx solid var(--tago-danger);
  border-radius: 999rpx;
  background: transparent;
  font-size: 22rpx;
}
</style>
