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
