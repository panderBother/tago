<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'

const props = defineProps<{
  source: string
  alt: string
  fixedBarSource?: string
  fixedBarKind?: 'tabs' | 'composer'
  contentEnd?: number
  sourceTop?: number
  sourceBottom?: number
}>()

const SOURCE_WIDTH = 941
const MIN_SCROLL_DISTANCE = 24
const MAX_CANVAS_SCALE = 1.135
const windowInfo = uni.getWindowInfo()
const stageWidth = shallowRef(Math.min(windowInfo.windowWidth, SOURCE_WIDTH))
const scrollViewportHeight = shallowRef(windowInfo.windowHeight)
const safeAreaTop = shallowRef(windowInfo.safeAreaInsets?.top ?? 0)
const hasFixedBar = computed(() => Boolean(props.fixedBarSource))
const sourceTop = computed(() => props.sourceTop ?? 58)
const sourceBottom = computed(() => props.sourceBottom ?? 1632)
const contentHeight = computed(() => hasFixedBar.value
  ? (props.contentEnd ?? 1492) - sourceTop.value
  : sourceBottom.value - sourceTop.value)
const fixedBarHeight = computed(() => {
  if (!hasFixedBar.value) return 0
  const ratio = props.fixedBarKind === 'composer' ? 0.1243 : 0.1488
  const minimum = props.fixedBarKind === 'composer' ? 68 : 82
  const maximum = props.fixedBarKind === 'composer' ? 117 : 140
  return Math.min(maximum, Math.max(minimum, stageWidth.value * ratio))
})
const canvasWidth = computed(() => {
  if (!hasFixedBar.value) return stageWidth.value
  const contentViewportHeight = Math.max(
    0,
    scrollViewportHeight.value - Math.max(18, safeAreaTop.value),
  )
  const coverWidth = (contentViewportHeight + MIN_SCROLL_DISTANCE) * SOURCE_WIDTH / contentHeight.value
  return Math.max(stageWidth.value, Math.min(coverWidth, stageWidth.value * MAX_CANVAS_SCALE))
})
const stageStyle = computed<Record<string, string>>(() => ({
  '--prototype-bar-height': `${fixedBarHeight.value}px`,
}))
const interactionStyle = computed(() => {
  const interactionTop = sourceTop.value
  const interactionHeight = contentHeight.value
  return {
    top: `${-(interactionTop / interactionHeight) * 100}%`,
    height: `${(1672 / interactionHeight) * 100}%`,
  }
})
const artStyle = computed(() => {
  if (hasFixedBar.value) return undefined
  return {
    top: `${-(sourceTop.value / contentHeight.value) * 100}%`,
    height: `${(1672 / contentHeight.value) * 100}%`,
  }
})
const canvasStyle = computed(() => ({
  aspectRatio: `${SOURCE_WIDTH} / ${contentHeight.value}`,
  width: `${canvasWidth.value}px`,
  marginLeft: `${(stageWidth.value - canvasWidth.value) / 2}px`,
}))

function syncStageSize() {
  const info = uni.getWindowInfo()
  stageWidth.value = Math.min(info.windowWidth, SOURCE_WIDTH)
  scrollViewportHeight.value = info.windowHeight - fixedBarHeight.value
  safeAreaTop.value = info.safeAreaInsets?.top ?? 0
}

onMounted(() => {
  syncStageSize()
  uni.onWindowResize(syncStageSize)
})
onUnmounted(() => uni.offWindowResize(syncStageSize))
</script>

<template>
  <view class="prototype-stage" :class="{ 'prototype-stage--fixed': hasFixedBar }" :style="stageStyle">
    <scroll-view scroll-y class="prototype-stage__scroll" :show-scrollbar="true">
      <view class="prototype-stage__scroll-inner">
        <view class="prototype-stage__canvas" :style="canvasStyle">
          <image class="prototype-stage__art" :src="source" mode="scaleToFill" :style="artStyle" :aria-label="alt" />
          <view class="prototype-stage__interactions" :style="interactionStyle">
            <slot />
          </view>
        </view>
      </view>
    </scroll-view>
    <view v-if="fixedBarSource" class="prototype-stage__fixed-bar">
      <image class="prototype-stage__fixed-art" :src="fixedBarSource" mode="scaleToFill" aria-hidden="true" />
      <view class="prototype-stage__fixed-interactions"><slot name="fixed" /></view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.prototype-stage { position:relative; width:100%; max-width:941px; height:100vh; height:100dvh; margin:0 auto; overflow:hidden; background:#f8f4e9; }
.prototype-stage__scroll { width:100%; height:100%; overscroll-behavior-y:contain; touch-action:pan-y; }
.prototype-stage__scroll :deep(.uni-scroll-view) { overflow-x:hidden !important; scrollbar-width:thin; scrollbar-color:rgba(32,88,79,.34) transparent; -webkit-overflow-scrolling:touch; }
.prototype-stage__scroll :deep(.uni-scroll-view::-webkit-scrollbar) { width:4px; }
.prototype-stage__scroll :deep(.uni-scroll-view::-webkit-scrollbar-track) { background:transparent; }
.prototype-stage__scroll :deep(.uni-scroll-view::-webkit-scrollbar-thumb) { border-radius:999px; background:rgba(32,88,79,.34); }
.prototype-stage--fixed .prototype-stage__scroll { position:fixed; z-index:1; top:0; bottom:var(--prototype-bar-height); left:50%; width:100%; max-width:941px; height:auto; transform:translateX(-50%); }
.prototype-stage__scroll-inner { width:100%; padding-top:max(18px,env(safe-area-inset-top)); overflow:hidden; }
.prototype-stage__canvas { position:relative; width:100%; overflow:hidden; }
.prototype-stage__art { position:absolute; top:-3.685%; left:0; display:block; width:100%; height:106.226%; }
.prototype-stage--fixed .prototype-stage__art { inset:0; height:100%; }
.prototype-stage__interactions { position:absolute; left:0; width:100%; }
.prototype-stage__interactions { z-index:2; }
.prototype-stage__fixed-bar { position:fixed; z-index:10; bottom:0; left:50%; width:100%; max-width:941px; height:var(--prototype-bar-height); overflow:hidden; border-radius:clamp(22px,5vw,48px) clamp(22px,5vw,48px) 0 0; background:#fffdf7; box-shadow:0 -10px 28px rgba(39,68,56,.12); transform:translateX(-50%); }
.prototype-stage__fixed-art,.prototype-stage__fixed-interactions { position:absolute; inset:0; width:100%; height:100%; }
.prototype-stage__fixed-interactions { z-index:2; }
</style>
