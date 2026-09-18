<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, shallowRef } from 'vue'
import AuthSpot from '@/components/auth/AuthSpot.vue'
import AuthStage from '@/components/auth/AuthStage.vue'
import { REGISTER_LAYOUT } from '@/components/auth/authLayout'
import { useAuthFlow } from '@/composables/useAuthFlow'
import registerBackground from '@/static/auth/register-bg.jpg'

const layout = REGISTER_LAYOUT
const debug = shallowRef(false)
const agreed = shallowRef(false)
const shaking = shallowRef(false)
const hint = shallowRef('')

const { form, challengeId, retryAfter, submitting, error, message, passwordMatches, requestCode, verify } = useAuthFlow('register')

const mismatch = computed(() => !!form.confirmPassword && !passwordMatches.value)
const notice = computed(() => hint.value || (mismatch.value ? '两次输入的密码不一致' : '') || error.value || message.value)
const failed = computed(() => !hint.value && !mismatch.value && !!error.value)
const codeLocked = computed(() => submitting.value || retryAfter.value > 0)

function toggleAgree() {
  agreed.value = !agreed.value
  hint.value = ''
}
function bounce() {
  shaking.value = false
  setTimeout(() => { shaking.value = true }, 20)
}
async function submit() {
  if (!agreed.value) {
    hint.value = '请先勾选同意《用户协议》和《隐私政策》'
    bounce()
    return
  }
  if (await verify()) uni.reLaunch({ url: '/pages/discover/index' })
}
function goBack() { uni.navigateBack() }

onLoad((query) => { if (query?.debug === '1') debug.value = true })
</script>

<template>
  <form class="auth" @submit="submit">
    <AuthStage :image="registerBackground" :debug="debug">
      <AuthSpot :spot="layout.tabLogin" label="tab-login">
        <button class="tap" hover-class="tap--pressed" type="button" @click="goBack" />
      </AuthSpot>

      <AuthSpot :spot="layout.email" label="email">
        <input v-model="form.email" class="ink" type="text" placeholder="请输入邮箱" placeholder-class="ink-placeholder" />
      </AuthSpot>

      <AuthSpot v-if="layout.code" :spot="layout.code" label="code">
        <input v-model="form.code" class="ink" type="number" :maxlength="6" placeholder="请输入验证码" placeholder-class="ink-placeholder" />
      </AuthSpot>

      <AuthSpot v-if="layout.sendCode" :spot="layout.sendCode" label="send-code">
        <button class="tap" hover-class="tap--pressed" type="button" :disabled="codeLocked" @click="requestCode" />
      </AuthSpot>

      <AuthSpot :spot="layout.password" label="password">
        <input v-model="form.password" class="ink" type="text" password placeholder="至少 8 位密码" placeholder-class="ink-placeholder" />
      </AuthSpot>

      <AuthSpot v-if="layout.confirm" :spot="layout.confirm" label="confirm">
        <input v-model="form.confirmPassword" class="ink" type="text" password placeholder="再次输入密码" placeholder-class="ink-placeholder" />
      </AuthSpot>

      <AuthSpot v-if="layout.agreeBox" :spot="layout.agreeBox" label="agree-box">
        <button class="tap" hover-class="tap--pressed" type="button" @click="toggleAgree">
          <text v-if="agreed" class="tick">✓</text>
        </button>
      </AuthSpot>

      <AuthSpot v-if="layout.agreeText" :spot="layout.agreeText" label="agree-text">
        <button class="agree" :class="{ 'agree--shaking': shaking }" type="button" @click="toggleAgree" />
      </AuthSpot>

      <AuthSpot :spot="layout.submit" label="submit">
        <button class="tap" hover-class="tap--pressed" :loading="submitting" :disabled="submitting" form-type="submit" />
      </AuthSpot>

      <AuthSpot :spot="layout.message" label="message">
        <text class="message" :class="{ 'message--error': failed }">{{ notice }}</text>
      </AuthSpot>
    </AuthStage>
  </form>
</template>

<style scoped lang="scss">
.auth { display: block; width: 100%; }

/* Invisible hit areas sitting on top of the mockup artwork. */
.tap {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
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

.tick {
  color: var(--tago-primary);
  font-size: 36rpx;
  font-weight: 900;
  line-height: 1;
}

.agree {
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
}

.agree--shaking { animation: agree-shake .32s ease; }

.message {
  display: block;
  width: 100%;
  color: var(--tago-primary);
  font-size: 24rpx;
  line-height: 1.4;
  text-align: center;
}

.message--error { color: var(--tago-danger); }

@keyframes agree-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10rpx); }
  75% { transform: translateX(10rpx); }
}
</style>
