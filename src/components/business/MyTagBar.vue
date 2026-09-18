<script setup lang="ts">
defineProps<{ tag?: string }>()
const emit = defineEmits<{ switch: [] }>()
</script>

<template>
  <view class="bar">
    <svg class="bar__paper" viewBox="0 0 900 86" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="bar-rough" x="-3%" y="-15%" width="106%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency=".012 .10" numOctaves="2" seed="13" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="B"/>
        </filter>
        <linearGradient id="bar-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#e5f0dd"/>
          <stop offset=".55" stop-color="#dcebd4"/>
          <stop offset="1" stop-color="#e6f1de"/>
        </linearGradient>
      </defs>
      <path
        d="M12 12 C110 7 230 13 380 8 C520 4 660 11 800 7 C840 6 872 9 890 12 L892 36 C895 54 889 70 893 86 C760 90 650 82 520 88 C380 93 260 84 130 89 C70 92 30 86 8 86 C5 68 11 54 8 38 Z"
        fill="url(#bar-fill)"
        filter="url(#bar-rough)"
        opacity=".96"
      />
    </svg>
    <text class="bar__label">我当前的 Tag</text>
    <text class="bar__tag">{{ tag || '# 发布你的第一个 Tag' }}</text>
    <button class="bar__action" @click="emit('switch')">{{ tag ? '切换Tag' : '去发布' }}　→</button>
  </view>
</template>

<style scoped lang="scss">
.bar { position:relative; display:grid; grid-template-columns:max-content minmax(0,1fr) max-content; align-items:center; gap:16rpx; width:100%; min-height:82rpx; margin-top:6rpx; padding:8rpx 16rpx 8rpx 20rpx; overflow:hidden; }
.bar__paper { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.bar__label { position:relative; z-index:2; display:block; font-family:"KaiTi","STKaiti","LXGW WenKai Screen",sans-serif; font-size:clamp(12px,21rpx,20px); font-weight:700; letter-spacing:.5rpx; white-space:nowrap; }
.bar__tag { position:relative; z-index:2; display:block; min-width:0; overflow:hidden; padding:7rpx 15rpx; border-radius:5rpx; background:linear-gradient(transparent 6%,rgba(250,220,112,.82) 6%,rgba(250,220,112,.82) 94%,transparent 94%); font-size:clamp(12px,21rpx,20px); letter-spacing:.5rpx; text-overflow:ellipsis; white-space:nowrap; transform:rotate(-.35deg); }
.bar__action { position:relative; z-index:2; flex:none; height:50rpx; padding:0 20rpx; color:var(--tago-primary); border-radius:999rpx; background:rgba(255,255,255,.78); box-shadow:inset 0 0 0 1rpx rgba(255,255,255,.55); font-size:17rpx; line-height:50rpx; white-space:nowrap; transition:transform .2s ease,background .2s ease; }
.bar__action::after { border:0; }
.bar__action:active { background:rgba(255,255,255,.94); transform:translateY(1px) scale(.98); }

@media (max-width:430px) {
  .bar { gap:7px; min-height:48px; padding:6px 10px; }
  .bar__tag { padding:4px 7px; }
  .bar__action { height:30px; padding:0 10px; font-size:11px; line-height:30px; }
}
</style>
