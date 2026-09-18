<script setup lang="ts">
function startApp() {
  uni.navigateTo({ url: '/pages/auth/login' })
}
</script>

<template>
  <view class="welcome">
    <image class="welcome-bg" src="/static/welcome-tag.png" mode="aspectFill" />
    <view class="welcome-cta" aria-label="开启我的 TAGO 之旅" @click="startApp" />
  </view>
</template>

<style scoped lang="scss">
.welcome {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.welcome-bg {
  display: block;
  width: 100%;
  height: 100%;
}

.welcome-cta {
  position: absolute;
  top: 81%;
  left: 9%;
  width: 82%;
  height: 9%;
  border-radius: 999rpx;
  background: transparent;
}
</style>
