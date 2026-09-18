<script setup lang="ts">
import type { ConversationItem } from '@/types/models'
import AvatarBadge from './AvatarBadge.vue'

defineProps<{ conversation: ConversationItem }>()
const emit = defineEmits<{ select: [id: string] }>()
function cleanMarker(value?: string) { return value?.replace(/^[^\p{L}\p{N}]+/u, '') }
</script>

<template>
  <button class="row" @click="emit('select', conversation.id)">
    <AvatarBadge :user="conversation.user" size="sm" />
    <view class="row__copy"><view class="row__title"><text>{{ conversation.user.name }}</text><text class="row__tag">因 {{ conversation.tagTitle }} 而认识</text></view><text class="row__preview">{{ conversation.preview }}</text></view>
    <view class="row__meta"><text>{{ conversation.timeLabel }}</text><text v-if="conversation.unread" class="row__badge">{{ conversation.unread }}</text><text v-else-if="conversation.marker" class="row__marker">{{ cleanMarker(conversation.marker) }}</text></view>
  </button>
</template>

<style scoped lang="scss">
.row { display:grid; grid-template-columns:72rpx 1fr 105rpx; align-items:center; gap:8rpx; width:100%; height:82rpx; min-height:0; margin-bottom:8rpx; padding:8rpx 14rpx; text-align:left; border-radius:14rpx; background:rgba(255,255,255,.74); box-shadow:0 5rpx 13rpx rgba(32,72,59,.06); }
.row__copy { display:flex; min-width:0; height:100%; flex-direction:column; justify-content:center; line-height:1.1; }
.row__title { display:flex; align-items:baseline; gap:10rpx; min-width:0; }.row__title > text:first-child { flex:none; font-size:22rpx; font-weight:850; }.row__tag { overflow:hidden; color:#4f5a54; font-size:16rpx; text-overflow:ellipsis; white-space:nowrap; }
.row__preview { display:block; overflow:hidden; margin-top:3rpx; color:var(--tago-muted); font-size:15rpx; line-height:1.1; text-overflow:ellipsis; white-space:nowrap; }.row__meta { display:flex; align-items:flex-end; align-self:stretch; flex-direction:column; justify-content:space-between; color:#777e79; font-size:15rpx; line-height:1.1; }
.row__badge { display:grid; place-items:center; width:32rpx; height:32rpx; color:white; border-radius:50%; background:var(--tago-danger); }.row__marker { overflow:hidden; max-width:105rpx; color:#7a765d; font-size:14rpx; text-overflow:ellipsis; white-space:nowrap; }
</style>
