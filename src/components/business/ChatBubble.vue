<script setup lang="ts">
import type { ChatMessage, UserSummary } from '@/types/models'
import AvatarBadge from './AvatarBadge.vue'

defineProps<{ message: ChatMessage; mine: UserSummary; theirs: UserSummary }>()
const emit = defineEmits<{ gift: [id: string] }>()
</script>

<template>
  <view v-if="message.side === 'system'" class="hint"><i></i>{{ message.content.replace('🌙 ', '') }}</view>
  <view v-else-if="message.side === 'gift'" class="message message--theirs">
    <AvatarBadge :user="theirs" size="sm" />
    <button class="gift" @click="emit('gift', message.id)"><i class="gift__icon"></i><view><text>Mori 送给你一件礼物</text><strong>{{ message.giftTitle }}</strong><text>{{ message.giftMeaning }}</text></view><text class="gift__arrow">›</text></button>
    <text class="message__time">{{ message.time }}</text>
  </view>
  <view v-else class="message" :class="`message--${message.side}`">
    <AvatarBadge :user="message.side === 'mine' ? mine : theirs" size="sm" />
    <view class="message__content">{{ message.content }}</view>
    <view class="message__meta"><text>{{ message.time }}</text><text v-if="message.read">已读</text></view>
  </view>
</template>

<style scoped lang="scss">
.message { display:grid; grid-template-columns:62rpx minmax(0,1fr) 52rpx; align-items:end; gap:8rpx; margin:13rpx 0; }.message--mine { grid-template-columns:52rpx minmax(0,1fr) 62rpx; }
.message--mine .avatar { grid-column: 3; grid-row: 1; }
.message--mine .message__content { grid-column:2; grid-row:1; color:#1f2e28; background:#dff1d9; border-radius:20rpx 20rpx 5rpx 20rpx; }
.message--mine .message__meta { grid-column: 1; grid-row: 1; text-align: right; }
.message__content { width:fit-content; max-width:100%; padding:12rpx 16rpx; border-radius:20rpx 20rpx 20rpx 5rpx; background:rgba(255,255,255,.94); box-shadow:0 5rpx 14rpx rgba(38,67,57,.07); font-size:19rpx; line-height:1.45; }.message__meta,.message__time { display:flex; flex-direction:column; color:#8a908b; font-size:14rpx; }.hint { display:flex; align-items:center; gap:8rpx; width:max-content; max-width:78%; margin:20rpx auto; padding:7rpx 16rpx; color:#7a7f79; border-radius:999rpx; background:rgba(255,255,255,.56); font-size:16rpx; }.hint i { width:16rpx; height:16rpx; border-radius:50%; background:#efc957; box-shadow:5rpx -3rpx 0 1rpx var(--tago-paper); }
.gift { display:grid; grid-template-columns:55rpx 1fr 22rpx; align-items:center; gap:8rpx; min-height:88rpx; padding:10rpx 13rpx; text-align:left; border-radius:10rpx 20rpx 20rpx 10rpx; background:var(--tago-note-yellow); box-shadow:var(--tago-shadow); line-height:1.3; }.gift__icon { position:relative; display:block; width:45rpx; height:45rpx; border:3rpx solid #d75c63; border-radius:7rpx; background:rgba(255,255,255,.55); }.gift__icon::before { content:''; position:absolute; top:-5rpx; left:17rpx; width:6rpx; height:48rpx; background:#efc64c; }.gift view { display:flex; flex-direction:column; font-size:14rpx; }.gift strong { font-size:22rpx; }.gift__arrow { font-size:38rpx; }
</style>
