<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  left: number
  top: number
  width: number
  height: number
}>()
const emit = defineEmits<{ activate: [] }>()

const position = computed(() => ({
  left: `${props.left}%`,
  top: `${props.top}%`,
  width: `${props.width}%`,
  height: `${props.height}%`,
}))
</script>

<template>
  <button class="prototype-hotspot" :style="position" :aria-label="label" @click="emit('activate')">{{ label }}</button>
</template>

<style scoped lang="scss">
.prototype-hotspot { position:absolute; min-height:0; margin:0; padding:0; overflow:hidden; color:transparent; border:0; border-radius:10px; background:transparent; box-shadow:none; font-size:1px; line-height:1; opacity:0; cursor:pointer; touch-action:manipulation; transition:opacity .12s ease,background-color .12s ease; }
.prototype-hotspot::after { border:0; }
.prototype-hotspot:active { background:var(--tago-accent); opacity:.16; }
.prototype-hotspot:focus-visible { outline:2px dashed var(--tago-primary); outline-offset:-2px; background:rgba(244,201,76,.16); opacity:1; }
</style>
