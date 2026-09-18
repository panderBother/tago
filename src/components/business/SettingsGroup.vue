<script setup lang="ts">
export interface SettingsRow {
  id: string
  symbol: string
  title: string
  description?: string
  value?: string
  danger?: boolean
  disabled?: boolean
}

const props = defineProps<{
  title: string
  subtitle?: string
  tone?: 'yellow' | 'green' | 'blue' | 'coral'
  rows: SettingsRow[]
}>()
const emit = defineEmits<{ select: [row: SettingsRow] }>()
</script>

<template>
  <section class="settings-group" :class="`settings-group--${props.tone || 'green'}`">
    <view class="settings-group__heading">
      <text class="settings-group__title">{{ props.title }}</text>
      <text v-if="props.subtitle" class="settings-group__subtitle">{{ props.subtitle }}</text>
    </view>
    <view class="settings-group__rows">
      <button
        v-for="row in props.rows"
        :key="row.id"
        class="settings-row"
        :class="{ 'settings-row--danger': row.danger }"
        :disabled="row.disabled"
        @click="emit('select', row)"
      >
        <text class="settings-row__symbol" aria-hidden="true">{{ row.symbol }}</text>
        <view class="settings-row__copy">
          <text class="settings-row__title">{{ row.title }}</text>
          <text v-if="row.description" class="settings-row__description">{{ row.description }}</text>
        </view>
        <text v-if="row.value" class="settings-row__value">{{ row.value }}</text>
        <text class="settings-row__arrow" aria-hidden="true">›</text>
      </button>
    </view>
  </section>
</template>

<style scoped lang="scss">
.settings-group {
  position:relative;
  padding:18rpx 14rpx 14rpx;
  border-radius:18rpx 28rpx 20rpx 25rpx;
  background:rgba(220,235,212,.7);
  box-shadow:0 8rpx 22rpx rgba(39,68,56,.07);
  overflow:hidden;
}
.settings-group::before {
  content:'';
  position:absolute;
  inset:0;
  background:repeating-linear-gradient(116deg,rgba(255,255,255,.13) 0 2px,transparent 2px 10px);
  pointer-events:none;
}
.settings-group--yellow { background:rgba(249,231,173,.72); }
.settings-group--blue { background:rgba(216,235,247,.74); }
.settings-group--coral { background:rgba(244,215,202,.66); }
.settings-group__heading { position:relative; z-index:1; display:flex; align-items:baseline; gap:12rpx; padding:0 12rpx 14rpx; }
.settings-group__title { font-size:28rpx; font-weight:900; letter-spacing:1rpx; }
.settings-group__subtitle { min-width:0; color:var(--tago-muted); font-size:17rpx; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.settings-group__rows { position:relative; z-index:1; overflow:hidden; border-radius:16rpx 22rpx 16rpx 20rpx; background:rgba(255,253,247,.9); }
.settings-row { display:grid; grid-template-columns:52rpx minmax(0,1fr) max-content 25rpx; align-items:center; gap:10rpx; width:100%; min-height:86rpx; margin:0; padding:12rpx 18rpx; color:var(--tago-ink); border:0; border-bottom:1rpx solid rgba(32,88,79,.1); border-radius:0; background:transparent; text-align:left; line-height:1.25; }
.settings-row:last-child { border-bottom:0; }
.settings-row::after { border:0; }
.settings-row:active { background:rgba(220,235,226,.38); }
.settings-row[disabled] { opacity:.48; }
.settings-row__symbol { display:grid; place-items:center; width:42rpx; height:42rpx; color:var(--tago-primary); border-radius:12rpx; background:rgba(32,88,79,.08); font-size:23rpx; font-weight:900; }
.settings-row__copy { display:flex; min-width:0; flex-direction:column; }
.settings-row__title { font-size:22rpx; font-weight:820; }
.settings-row__description { margin-top:5rpx; color:var(--tago-muted); font-size:16rpx; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.settings-row__value { max-width:155rpx; color:var(--tago-muted); font-size:18rpx; overflow:hidden; text-align:right; text-overflow:ellipsis; white-space:nowrap; }
.settings-row__arrow { color:#818781; font-size:34rpx; line-height:1; }
.settings-row--danger .settings-row__title,.settings-row--danger .settings-row__symbol { color:var(--tago-danger); }
</style>
