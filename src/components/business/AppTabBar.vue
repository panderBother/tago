<script setup lang="ts">
withDefaults(defineProps<{ active:'discover'|'meet'|'create' }>(), { active:'discover' })
function navigate(path:string) { uni.redirectTo({ url:path }) }
</script>

<template>
  <view class="tabs">
    <button class="tabs__item" :class="{ 'tabs__item--active':active==='discover' }" @click="navigate('/pages/discover/index')"><i class="icon-home"></i><text>发现</text></button>
    <button class="tabs__create" aria-label="发布 Tag" @click="navigate('/pages/tag/compose')"><i class="icon-plus"></i><text>发Tag</text></button>
    <button class="tabs__item" :class="{ 'tabs__item--active':active==='meet' }" @click="navigate('/pages/meet/index')"><i class="icon-people"><b></b></i><text>相遇</text></button>
  </view>
</template>

<style scoped lang="scss">
.tabs { position:fixed; z-index:20; right:0; bottom:0; left:0; display:flex; justify-content:space-around; width:100%; max-width:var(--tago-content-width); height:calc(112rpx + env(safe-area-inset-bottom)); margin:0 auto; padding:10rpx 50rpx env(safe-area-inset-bottom); border-radius:34rpx 34rpx 0 0; background:rgba(255,253,247,.98); box-shadow:0 -8rpx 24rpx rgba(33,68,55,.07); }
.tabs__item { display:flex; flex-direction:column; align-items:center; width:130rpx; padding:0; color:#68716d; border:0; border-radius:0; background:transparent; box-shadow:none; font-size:23rpx; line-height:1.15; }.tabs__item::after,.tabs__create::after { border:0; }.tabs__item--active { color:var(--tago-primary); font-weight:800; }
.tabs__item i { position:relative; display:block; width:38rpx; height:38rpx; margin-bottom:5rpx; color:currentColor; }
.icon-home { margin-top:3rpx; border:0; background:currentColor; clip-path:polygon(50% 0,100% 39%,88% 39%,88% 100%,60% 100%,60% 65%,40% 65%,40% 100%,12% 100%,12% 39%,0 39%); }
.icon-people::before,.icon-people::after { content:''; position:absolute; border:3rpx solid currentColor; border-radius:50%; }.icon-people::before { top:0; left:5rpx; width:13rpx; height:13rpx; }.icon-people::after { top:4rpx; right:1rpx; width:11rpx; height:11rpx; }.icon-people b::before,.icon-people b::after { content:''; position:absolute; bottom:1rpx; border:3rpx solid currentColor; border-radius:50% 50% 8rpx 8rpx; }.icon-people b::before { left:0; width:22rpx; height:14rpx; }.icon-people b::after { right:-2rpx; width:19rpx; height:12rpx; }
.tabs__create { position:relative; display:flex; flex-direction:column; align-items:center; width:150rpx; margin-top:-43rpx; padding:0; color:var(--tago-primary); border:0; border-radius:0; background:transparent; box-shadow:none; font-size:23rpx; line-height:1; }.tabs__create::before { content:''; position:absolute; top:2rpx; left:17rpx; width:7rpx; height:16rpx; border-radius:999rpx; background:var(--tago-accent); transform:rotate(-35deg); box-shadow:12rpx 5rpx 0 -1rpx var(--tago-accent),18rpx 16rpx 0 -2rpx var(--tago-accent); }.icon-plus { position:relative; display:block; width:82rpx; height:82rpx; margin-bottom:7rpx; border-radius:50%; background:var(--tago-primary); box-shadow:0 7rpx 18rpx rgba(31,75,63,.22); }.icon-plus::before,.icon-plus::after { content:''; position:absolute; top:39rpx; left:22rpx; width:38rpx; height:4rpx; border-radius:9rpx; background:white; }.icon-plus::after { transform:rotate(90deg); }
</style>
