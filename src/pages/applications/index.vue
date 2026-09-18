<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ApplicationCard, AppHeader, AppTabBar } from '@/components/business'
import AsyncState from '@/components/ui/AsyncState.vue'
import { useApplicationsData } from '@/composables/useApplicationsData'

const { applications, loading, error, load, accept, decline } = useApplicationsData()

function goBack() { uni.navigateBack() }
function openSettings() { uni.navigateTo({ url: '/pages/account/index' }) }
function openDetail(id: string) { uni.navigateTo({ url: `/pages/tag/compare?id=${encodeURIComponent(id)}` }) }
async function handleAccept(id: string) {
  const acceptance = await accept(id)
  uni.showToast({ title: '已接受，正在创建会话', icon: 'none' })
  setTimeout(() => uni.navigateTo({ url: `/pages/chat/index?id=${encodeURIComponent(acceptance?.conversationId ?? id)}` }), 350)
}
async function handleDecline(id: string) {
  await decline(id)
  uni.showToast({ title: '申请已归档', icon: 'none' })
}

onShow(load)
</script>

<template>
  <view class="tago-page applications-page">
    <AppHeader back settings title="有人想认识你" subtitle="他们认真回答了你的问题" @back="goBack" @settings="openSettings" />
    <view class="applications-title"><text class="tago-section-title">认识申请</text><text>{{ applications.length }} 个待处理</text></view>
    <AsyncState :loading="loading" :error="error" :empty="!applications.length" empty-title="暂时没有新申请" empty-description="有人认真回应你的 Tag 后，会出现在这里。" @retry="load">
      <view class="applications-list"><ApplicationCard v-for="application in applications" :key="application.id" :application="application" @detail="openDetail" @accept="handleAccept" @decline="handleDecline" /></view>
    </AsyncState>
    <AppTabBar active="meet" />
  </view>
</template>

<style scoped lang="scss">
.applications-page { display:flex; min-height:100dvh; flex-direction:column; overflow-x:hidden; }
.applications-title { display:flex; align-items:center; justify-content:space-between; color:#737871; font-size:16rpx; }
.applications-title .tago-section-title { color:var(--tago-ink); }
.applications-list { display:flex; min-height:986rpx; flex:1; flex-direction:column; transition:opacity .2s ease; }
.applications-list :deep(.application) { min-height:320rpx; flex:1 1 320rpx; margin-bottom:14rpx; }
.applications-list :deep(.application:last-child) { margin-bottom:0; }
.applications-list--loading { opacity:.72; }
.applications-empty { margin-top:70rpx; color:#70776f; font-size:20rpx; text-align:center; }
</style>
