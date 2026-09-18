<script setup lang="ts">
import AppHeader from '@/components/business/AppHeader.vue'

defineProps<{ title: string; subtitle: string; back?: boolean }>()
const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <view class="auth-shell">
    <AppHeader :back="back" variant="auth" :title="title" :subtitle="subtitle" @back="emit('back')" />
    <view class="auth-shell__paper"><slot /></view>
    <text class="auth-shell__promise">你的每一次真诚表达，都值得被看见 ♡</text>
  </view>
</template>

<style scoped lang="scss">
.auth-shell { position:relative; display:flex; width:100%; max-width:720rpx; min-height:100dvh; flex-direction:column; margin:0 auto; padding:52rpx 34rpx 48rpx; overflow:hidden; background:radial-gradient(circle at 90% 8%,rgba(131,163,131,.2),transparent 24%),var(--tago-paper); }
.auth-shell__paper { position:relative; z-index:2; padding:40rpx 34rpx 36rpx; border-radius:10rpx 26rpx 16rpx 22rpx; background:rgba(255,253,247,.93); box-shadow:var(--tago-shadow); clip-path:polygon(0 1%,5% 0,10% 1%,16% 0,24% 1%,31% 0,40% 1%,48% 0,57% 1%,66% 0,73% 1%,82% 0,90% 1%,100% 0,99% 99%,92% 100%,84% 99%,76% 100%,68% 99%,58% 100%,49% 99%,40% 100%,31% 99%,23% 100%,14% 99%,7% 100%,0 99%); }
.auth-shell__promise { display:block; margin:auto auto 0; padding-top:42rpx; color:#70756f; font-size:23rpx; letter-spacing:1rpx; text-align:center; transform:rotate(-1deg); }
</style>
