<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  left: number
  top: number
  width: number
  height: number
  maxlength?: number
  multiline?: boolean
}>(), {
  maxlength: 200,
  multiline: true,
})
const model = defineModel<string>({ default: '' })
const position = computed(() => ({
  left: `${props.left}%`,
  top: `${props.top}%`,
  width: `${props.width}%`,
  height: `${props.height}%`,
}))
</script>

<template>
  <textarea v-if="multiline" v-model="model" class="prototype-field" :style="position" :maxlength="maxlength" :aria-label="label" />
  <input v-else v-model="model" class="prototype-field" :style="position" :maxlength="maxlength" :aria-label="label" />
</template>

<style scoped lang="scss">
.prototype-field { position:absolute; z-index:3; min-height:0; padding:10px 12px; color:transparent; border:0; border-radius:12px; outline:0; background:transparent; font-family:"LXGW WenKai Screen","KaiTi",sans-serif; font-size:clamp(14px,2.35vw,23px); line-height:1.45; opacity:0; resize:none; }
.prototype-field:focus,
.prototype-field:focus-within { color:#26322d; background:rgba(255,253,247,.96); box-shadow:0 5px 18px rgba(32,88,79,.15); opacity:1; }
</style>
