<script setup lang="ts">
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button class="settings-button" aria-label="打开设置" @click="emit('click')">
    <svg viewBox="0 0 36 30" aria-hidden="true">
      <path d="M5 9h26M5 21h26" />
      <circle cx="13" cy="9" r="3.3" />
      <circle cx="24" cy="21" r="3.3" />
    </svg>
  </button>
</template>

<style scoped lang="scss">
.settings-button {
  display:grid;
  place-items:center;
  width:64rpx;
  height:64rpx;
  margin:0;
  padding:0;
  color:var(--tago-ink);
  border:0;
  border-radius:0;
  background:transparent;
  transition:transform .2s ease,opacity .2s ease;
}
.settings-button::after { border:0; }
.settings-button:active { opacity:.7; transform:scale(.94); }
.settings-button svg { width:42rpx; height:36rpx; overflow:visible; }
.settings-button path { fill:none; stroke:currentColor; stroke-width:2.6; stroke-linecap:round; }
.settings-button circle { fill:var(--tago-paper-white); stroke:currentColor; stroke-width:2.3; }
</style>
