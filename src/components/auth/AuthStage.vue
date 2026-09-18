<script setup lang="ts">
import { computed, provide } from 'vue'
import { authDebugKey } from './authLayout'

const props = defineProps<{ image: string; debug?: boolean }>()

provide(authDebugKey, computed(() => !!props.debug))
</script>

<template>
  <view class="stage">
    <image class="stage__bg" :src="image" mode="widthFix" />
    <view v-if="debug" class="stage__grid" />
    <view class="stage__layer"><slot /></view>
  </view>
</template>

<style scoped lang="scss">
.stage { position: relative; width: 100%; }
.stage__bg { display: block; width: 100%; height: auto; pointer-events: none; }

.stage__grid {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image:
    repeating-linear-gradient(to right, rgba(255, 60, 60, .5) 0 1rpx, transparent 1rpx 10%),
    repeating-linear-gradient(to bottom, rgba(60, 120, 255, .5) 0 1rpx, transparent 1rpx 5%);
  pointer-events: none;
}

.stage__layer { position: absolute; top: 0; right: 0; bottom: 0; left: 0; }
</style>
