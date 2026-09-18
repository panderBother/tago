<script setup lang="ts">
import { computed, inject } from 'vue'
import { authDebugKey, type PrototypeSpot } from './authLayout'

const props = defineProps<{ spot: PrototypeSpot; label?: string }>()

const debug = inject(authDebugKey)
const style = computed(() => ({
  left: `${props.spot.x}%`,
  top: `${props.spot.y}%`,
  width: `${props.spot.w}%`,
  height: `${props.spot.h}%`,
}))
</script>

<template>
  <view class="spot" :class="{ 'spot--debug': debug }" :style="style">
    <slot />
    <text v-if="debug && label" class="spot__label">{{ label }}</text>
  </view>
</template>

<style scoped lang="scss">
.spot { position: absolute; }

.spot--debug {
  border: 2rpx dashed rgba(224, 60, 60, .9);
  background: rgba(224, 60, 60, .08);
}

.spot__label {
  position: absolute;
  top: -22rpx;
  left: 0;
  padding: 0 6rpx;
  color: #fff;
  border-radius: 6rpx;
  background: rgba(224, 60, 60, .9);
  font-size: 18rpx;
  line-height: 22rpx;
  white-space: nowrap;
}
</style>
