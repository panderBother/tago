<script setup lang="ts">
withDefaults(defineProps<{ label:string; type?:'text'|'password'|'number'; placeholder?:string; error?:string; maxlength?:number }>(), { type:'text', placeholder:'', error:'', maxlength:128 })
const model = defineModel<string>({ required:true })
</script>

<template>
  <label class="field">
    <text class="field__label">{{ label }}</text>
    <input v-model="model" class="field__input" :type="type" :placeholder="placeholder" :maxlength="maxlength" :password="type === 'password'" />
    <text v-if="error" class="field__error">{{ error }}</text>
  </label>
</template>

<style scoped lang="scss">
.field { display:block; margin-bottom:25rpx; }
.field__label { display:block; margin:0 8rpx 9rpx; color:var(--tago-ink); font-size:26rpx; font-weight:850; }
.field__input { width:100%; height:86rpx; padding:0 25rpx; color:var(--tago-ink); border:2rpx solid rgba(32,88,79,.13); border-radius:24rpx; background:rgba(236,240,231,.58); font-size:26rpx; }
.field__input:focus { border-color:rgba(32,88,79,.5); background:#fff; }
.field__error { display:block; min-height:28rpx; margin:7rpx 10rpx 0; color:var(--tago-danger); font-size:20rpx; }
</style>
