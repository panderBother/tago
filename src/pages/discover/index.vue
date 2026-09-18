<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { AppHeader, AppTabBar, MyTagBar, PinnedTagCard, TagCard } from '@/components/business'
import AsyncState from '@/components/ui/AsyncState.vue'
import { useDiscoverData } from '@/composables/useDiscoverData'
import type { TagItem } from '@/types/models'

const { tags, featuredTag, currentTag, loading, error, load } = useDiscoverData()

function openComposer() { uni.navigateTo({ url: '/pages/tag/compose' }) }
function openSettings() { uni.navigateTo({ url: '/pages/account/index' }) }
function openTag(tag: TagItem) {
  const path = tag.ctaType === 'APPLY' ? 'respond' : 'compare'
  uni.navigateTo({ url: `/pages/tag/${path}?id=${encodeURIComponent(tag.id)}` })
}

onShow(load)
</script>

<template>
  <view class="tago-page discover-page">
    <AppHeader
      settings
      variant="home"
      title="今天想认识怎样的人？"
      subtitle="看看此刻有人留下了什么"
      @settings="openSettings"
    />
    <MyTagBar :tag="currentTag || '还没有发布 Tag'" @switch="openComposer" />
    <PinnedTagCard v-if="featuredTag" :tag="featuredTag" @action="openTag" />
    <view class="discover-heading">
      <text class="tago-section-title">也许你会想认识这些 Tag</text>
      <text class="discover-heading__note">遇见更多有趣的人<br>和正在发生的生活 ♡</text>
    </view>
    <AsyncState :loading="loading" :error="error" :empty="!tags.length" empty-title="暂时没有推荐" empty-description="稍后刷新，看看有没有新的同频 Tag。" @retry="load">
      <view class="discover-list" :class="{ 'discover-list--loading': loading }"><TagCard v-for="tag in tags" :key="tag.id" :tag="tag" @action="openTag" /></view>
    </AsyncState>
    <AppTabBar active="discover" />
  </view>
</template>

<style scoped lang="scss">
.discover-page { display:flex; min-height:100dvh; flex-direction:column; overflow-x:hidden; }
.discover-heading { display:flex; align-items:flex-end; justify-content:space-between; margin:24rpx 6rpx 12rpx; }
.discover-heading .tago-section-title { margin:0; }
.discover-heading__note { color:#72736d; font-size:14rpx; line-height:1.45; text-align:right; transform:rotate(-2deg); }
.discover-list { display:flex; flex:1; flex-direction:column; transition:opacity .2s ease; }
.discover-list :deep(.tag-card) { min-height:176rpx; margin-bottom:10rpx; }
.discover-list :deep(.tag-card:last-child) { margin-bottom:0; }
.discover-list--loading { opacity:.72; }

@media (max-width:430px) {
  .discover-heading { margin-top:18px; margin-bottom:8px; }
  .discover-list :deep(.tag-card) { min-height:116px; margin-bottom:6px; }
}

@media (max-width:360px) {
  .discover-heading__note { display:none; }
}
</style>
