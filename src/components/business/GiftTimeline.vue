<script setup lang="ts">
import type { GiftMoment } from '@/types/models'
defineProps<{ moments:GiftMoment[] }>()
const emit = defineEmits<{ select:[id:string] }>()
</script>

<template>
  <view class="timeline">
    <image class="timeline__prototype" src="/static/prototypes/gifts.jpg" mode="widthFix" aria-hidden="true" />
    <button v-for="(moment,index) in moments" :key="moment.id" class="timeline__hotspot" :class="`timeline__hotspot--${index + 1}`" :aria-label="`${moment.title}，${moment.story}`" @click="emit('select',moment.id)" />
  </view>
</template>

<style scoped lang="scss">
.timeline { position:relative; width:calc(100% + 56rpx); height:1050rpx; margin-left:-28rpx; overflow:hidden; }.timeline__prototype { position:absolute; top:-278rpx; left:0; width:750rpx; max-width:none; height:auto; }.timeline__hotspot { position:absolute; z-index:2; width:310rpx; height:255rpx; padding:0; opacity:0; }.timeline__hotspot--1 { top:75rpx; left:22rpx; }.timeline__hotspot--2 { top:250rpx; right:18rpx; }.timeline__hotspot--3 { top:500rpx; left:22rpx; }.timeline__hotspot--4 { top:750rpx; right:18rpx; }
</style>
