<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { AppHeader, AppTabBar, ConversationRow } from '@/components/business'
import AsyncState from '@/components/ui/AsyncState.vue'
import { useMeetData } from '@/composables/useMeetData'

const { conversations, pendingCount, loading, error, load } = useMeetData()

function openApplications() { uni.navigateTo({ url: '/pages/applications/index' }) }
function openChat(id: string) { uni.navigateTo({ url: `/pages/chat/index?id=${encodeURIComponent(id)}` }) }
function openSettings() { uni.navigateTo({ url: '/pages/account/index' }) }

onShow(load)
</script>

<template>
  <view class="tago-page meet-page">
    <AppHeader settings title="相遇" subtitle="因为一个 Tag，认识一个人" @settings="openSettings" />
    <button class="application-entry" @click="openApplications">
      <view class="application-entry__avatars" aria-hidden="true"><text /><text /><text /></view>
      <view class="application-entry__copy">
        <view class="application-entry__title"><text>有人想认识你</text><text v-if="pendingCount" class="application-entry__badge">{{ pendingCount }}</text></view>
        <text>{{ pendingCount ? `点进去查看 ${pendingCount} 个新的认识申请` : '看看他们认真写下的回答' }}</text>
      </view>
      <text class="application-entry__arrow">→</text>
    </button>
    <text class="tago-section-title">已经遇见的人</text>
    <AsyncState :loading="loading" :error="error" :empty="!conversations.length" empty-title="还没有遇见的人" empty-description="当认识申请被接受后，你们的会话会出现在这里。" @retry="load">
      <view class="conversation-list"><ConversationRow v-for="conversation in conversations" :key="conversation.id" :conversation="conversation" @select="openChat" /></view>
    </AsyncState>
    <AppTabBar active="meet" />
  </view>
</template>

<style scoped lang="scss">
.meet-page { display:flex; min-height:100dvh; flex-direction:column; overflow-x:hidden; }
.application-entry { display:flex; align-items:center; width:100%; min-height:88rpx; margin:8rpx 0 12rpx; padding:10rpx 18rpx; text-align:left; border:0; border-radius:18rpx; background:linear-gradient(100deg,#f8e9aa,#f4efc9); box-shadow:var(--tago-shadow); }
.application-entry::after { border:0; }
.application-entry__avatars { display:flex; width:104rpx; }
.application-entry__avatars text { display:grid; place-items:center; width:48rpx; height:48rpx; margin-right:-15rpx; color:#fff; border:3rpx solid #fff; border-radius:50%; background:#6c8f83; font-size:18rpx; }
.application-entry__copy { display:flex; flex:1; flex-direction:column; margin-left:9rpx; line-height:1.35; }
.application-entry__title { display:flex; align-items:center; gap:10rpx; }
.application-entry__badge { display:grid; place-items:center; min-width:34rpx; height:34rpx; padding:0 8rpx; color:#fff; border-radius:999rpx; background:var(--tago-danger); font-size:19rpx; font-weight:850; line-height:1; }
.application-entry__copy text:first-child { font-size:22rpx; font-weight:850; }
.application-entry__copy text:last-child { color:#626a65; font-size:15rpx; }
.application-entry__arrow { color:var(--tago-primary); font-size:29rpx; }
.conversation-list { display:flex; flex-direction:column; transition:opacity .2s ease; }
.conversation-list :deep(.row) { min-height:118rpx; margin-bottom:14rpx; }
.conversation-list :deep(.row:last-child) { margin-bottom:0; }
.conversation-list--loading { opacity:.72; }
</style>
