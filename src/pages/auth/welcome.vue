<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { onUnmounted } from 'vue'
import { useWelcomeLayout } from '@/composables/useWelcomeLayout'

const { layout, syncViewport } = useWelcomeLayout()

function onResize(result: UniNamespace.WindowResizeResult) {
  syncViewport(result.size)
}

function startApp() {
  uni.navigateTo({ url: '/pages/auth/login' })
}

onLoad(() => { syncViewport(); uni.onWindowResize(onResize) })
onUnmounted(() => uni.offWindowResize(onResize))
</script>

<template>
  <view class="welcome">
    <view class="welcome-fallback" aria-hidden="true">
      <view class="welcome-fallback__brand">TAGO</view>
      <view class="welcome-fallback__note">把想遇见的人写成一张纸条</view>
      <view class="welcome-fallback__button">开启我的 TAGO 之旅</view>
    </view>
    <image v-if="layout" class="welcome-bg" :style="layout.image" src="/static/welcome-tag.png" mode="scaleToFill" />
    <view v-if="layout" class="welcome-cta" :style="layout.cta" aria-label="开启我的 TAGO 之旅" @click="startApp" />
  </view>
</template>

<style scoped lang="scss">
.welcome {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #f8f4e9;
}

.welcome-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28rpx;
  padding: 64rpx;
  color: #20584f;
  background:
    radial-gradient(circle at 20% 16%, rgba(244, 201, 76, .34), transparent 32%),
    radial-gradient(circle at 82% 76%, rgba(32, 88, 79, .15), transparent 36%),
    #f8f4e9;
  text-align: center;
}

.welcome-fallback__brand {
  font-size: 72rpx;
  font-weight: 900;
  letter-spacing: 3rpx;
}

.welcome-fallback__note {
  max-width: 520rpx;
  color: rgba(32, 88, 79, .78);
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.5;
}

.welcome-fallback__button {
  width: min(580rpx, 82vw);
  height: 92rpx;
  border-radius: 999rpx;
  color: #fffdf7;
  background: #20584f;
  box-shadow: 0 18rpx 36rpx rgba(32, 88, 79, .16);
  font-size: 30rpx;
  font-weight: 800;
  line-height: 92rpx;
}

.welcome-bg {
  position: absolute;
  display: block;
}

.welcome-cta {
  position: absolute;
  border-radius: 999rpx;
  background: transparent;
}
</style>
