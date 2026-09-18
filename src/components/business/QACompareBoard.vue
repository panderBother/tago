<script setup lang="ts">
import type { QAItem, UserSummary } from '@/types/models'
import AvatarBadge from './AvatarBadge.vue'

defineProps<{ mine: QAItem[]; theirs: QAItem[]; me: UserSummary; them: UserSummary }>()
</script>

<template>
  <view class="compare">
    <view v-for="(item, index) in mine" :key="item.id" class="compare__row">
      <view class="compare__question"><text>Q{{ index + 1 }}</text><text>{{ item.question }}</text><i aria-hidden="true" :class="index === 1 ? 'sprout' : 'book'" /></view>
      <view class="compare__answers">
        <view class="compare__answer compare__answer--mine"><view class="compare__who"><AvatarBadge :user="me" size="sm" /><text>我的回答</text></view><text>{{ item.answer }}</text></view>
        <text class="compare__vs">VS</text>
        <view class="compare__answer compare__answer--theirs"><view class="compare__who"><AvatarBadge :user="them" size="sm" /><text>TA 的回答</text></view><text>{{ theirs[index]?.answer }}</text></view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.compare__row { margin-bottom:14rpx; padding:10rpx 12rpx; border-radius:18rpx; background:rgba(255,255,255,.42); box-shadow:0 5rpx 15rpx rgba(39,68,56,.07); }.compare__question { display:grid; grid-template-columns:50rpx 1fr 38rpx; align-items:center; gap:6rpx; margin-bottom:8rpx; font-size:23rpx; font-weight:850; }
.compare__question text:first-child { color:#171c18; font-size:32rpx; }.compare__question i { position:relative; width:34rpx; height:27rpx; }.compare__question .book { border:2rpx solid #5c786e; border-radius:2rpx 9rpx 2rpx 2rpx; }.compare__question .book::after { content:''; position:absolute; top:0; left:50%; height:100%; border-left:2rpx solid #5c786e; }.compare__question .sprout::before,.compare__question .sprout::after { content:''; position:absolute; top:2rpx; width:14rpx; height:20rpx; border-radius:90% 10%; background:#78a94d; }.compare__question .sprout::before { left:3rpx; transform:rotate(-35deg); }.compare__question .sprout::after { right:3rpx; transform:scaleX(-1) rotate(-35deg); }
.compare__answers { position:relative; display:grid; grid-template-columns:1fr 1fr; gap:13rpx; }.compare__answer { min-height:128rpx; padding:12rpx; border-radius:8rpx 17rpx; font-size:18rpx; line-height:1.45; }
.compare__answer--mine { background: var(--tago-note-green); } .compare__answer--theirs { background: var(--tago-note-blue); }
.compare__who { display:flex; align-items:center; gap:7rpx; margin-bottom:7rpx; font-weight:800; }
.compare__vs { position: absolute; z-index: 2; top: 50%; left: 50%; display: grid; place-items: center; width: 44rpx; height: 44rpx; color: var(--tago-primary); border-radius: 50%; background: var(--tago-paper-white); font-size: 17rpx; font-weight: 900; transform: translate(-50%,-50%) rotate(-8deg); }
</style>
