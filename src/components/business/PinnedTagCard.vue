<script setup lang="ts">
import type { TagItem } from '@/types/models'
import AvatarBadge from './AvatarBadge.vue'
import BookStackIllustration from './BookStackIllustration.vue'
import PinnedPaperBg from '@/components/ui/PinnedPaperBg.vue'
defineProps<{ tag: TagItem }>()
const emit = defineEmits<{ action: [tag: TagItem] }>()
</script>

<template>
  <view class="pinned" data-testid="pinned-tag-card">
    <PinnedPaperBg />
    <view class="pinned__label"><i class="pinned__crown"></i>置顶 Tag</view>
    <text v-if="tag.price" class="pinned__price">¥{{ tag.price }}</text>
    <view class="pinned__left">
      <view class="pinned__person">
        <AvatarBadge size="lg" :user="tag.author" />
        <view>
          <text class="pinned__name">{{ tag.author.name }}</text>
          <text class="pinned__meta">{{ tag.author.city }} · {{ tag.timeLabel }}</text>
        </view>
      </view>
      <text class="pinned__title">{{ tag.title }}</text>
      <text class="pinned__summary">{{ tag.summary }}</text>
      <view class="pinned__labels"><text v-for="label in tag.labels" :key="label">{{ label }}</text></view>
      <view class="pinned__books"><BookStackIllustration /></view>
    </view>

    <view class="pinned__right">
      <view class="pinned__questions">
        <view v-for="(item,index) in tag.questions" :key="item.id">
          <text>Q{{ index + 1 }}</text>
          <view class="pinned__qa-copy">
            <text>{{ item.question }}</text>
            <text>A：{{ item.answer }}</text>
          </view>
        </view>
      </view>
      <button class="pinned__cta" @click="emit('action', tag)">想认识TA　→</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.pinned { position:relative; display:grid; grid-template-columns:51% 49%; min-height:360rpx; margin-top:24rpx; margin-bottom:8rpx; padding:58rpx 24rpx 22rpx 28rpx; overflow:visible; background:transparent; }
.pinned::after { content:''; position:absolute; z-index:1; right:24rpx; bottom:18rpx; left:24rpx; height:18rpx; border-radius:50%; background:rgba(184,145,56,.08); filter:blur(8rpx); pointer-events:none; }
.pinned__paper { position:absolute; z-index:0; top:-8rpx; right:-8rpx; bottom:-9rpx; left:-8rpx; width:calc(100% + 16rpx); height:calc(100% + 17rpx); pointer-events:none; }
.pinned__label { position:absolute; top:-2rpx; left:22rpx; z-index:3; display:flex; align-items:center; gap:9rpx; padding:10rpx 22rpx 11rpx; background:linear-gradient(96deg,#f3c83f,#f8dc79 72%,#f1c23b); clip-path:polygon(2% 8%,98% 0,96% 91%,72% 87%,50% 100%,28% 89%,0 96%); font-family:"KaiTi","STKaiti","LXGW WenKai Screen",sans-serif; font-size:25rpx; font-weight:700; letter-spacing:1rpx; transform:rotate(-3deg); filter:drop-shadow(0 3rpx 4rpx rgba(116,88,16,.12)); }
.pinned__crown { position:relative; display:inline-block; width:25rpx; height:19rpx; background:#1e2b25; clip-path:polygon(0 25%,22% 55%,38% 0,54% 55%,78% 6%,100% 34%,88% 100%,10% 100%); }
.pinned__price { position:absolute; z-index:3; top:18rpx; right:20rpx; color:#913722; font-size:36rpx; font-weight:850; transform:rotate(-7deg); }
.pinned__price::before { content:''; position:absolute; z-index:-1; right:-8rpx; bottom:0; width:102rpx; height:18rpx; border-radius:50%; background:rgba(244,194,59,.5); transform:rotate(3deg); }
.pinned__left { position:relative; z-index:2; min-width:0; padding:8rpx 14rpx 0 2rpx; }
.pinned__person { display:flex; align-items:center; gap:10rpx; }
.pinned__name,.pinned__meta,.pinned__title,.pinned__summary { display:block; }
.pinned__name { font-size:25rpx; font-weight:700; }
.pinned__meta { margin-top:3rpx; color:var(--tago-muted); font-size:16rpx; letter-spacing:.5rpx; }
.pinned__title { overflow:hidden; margin-top:24rpx; font-family:"KaiTi","STKaiti","LXGW WenKai Screen",sans-serif; font-size:35rpx; font-weight:700; line-height:1.2; letter-spacing:2rpx; text-overflow:ellipsis; white-space:nowrap; }
.pinned__summary { width:92%; margin-top:10rpx; color:#5d5a4d; font-family:"KaiTi","STKaiti","LXGW WenKai Screen",sans-serif; font-size:19rpx; line-height:1.5; letter-spacing:.7rpx; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.pinned__labels { display:flex; gap:10rpx; margin-top:14rpx; color:#626454; font-size:14rpx; white-space:nowrap; }
.pinned__labels text { padding:3rpx 7rpx; border-radius:7rpx; background:rgba(255,255,255,.27); }
.pinned__labels text::before { content:''; display:inline-block; width:7rpx; height:11rpx; margin-right:5rpx; background:#5b7168; clip-path:polygon(0 0,100% 0,100% 100%,50% 70%,0 100%); }
.pinned__books { position:absolute; right:-6rpx; bottom:-8rpx; width:126rpx; height:94rpx; pointer-events:none; transform:rotate(-3deg); }
.pinned__right { position:relative; z-index:2; display:flex; min-width:0; flex-direction:column; justify-content:space-between; padding:2rpx 0 0 10rpx; }
.pinned__questions { margin:4rpx 0 72rpx 4rpx; padding:11rpx 15rpx; border:1rpx solid rgba(255,255,255,.32); border-radius:16rpx 13rpx 18rpx 14rpx; background:linear-gradient(105deg,rgba(255,255,255,.62),rgba(255,253,242,.34)); box-shadow:inset 0 0 24rpx rgba(255,255,255,.38),0 7rpx 16rpx rgba(94,77,30,.05); transform:rotate(-.25deg); }
.pinned__questions > view { display:grid; grid-template-columns:38rpx 1fr; gap:4rpx; padding:7rpx 0; border-bottom:1rpx solid rgba(79,67,32,.13); color:#514f46; font-family:"KaiTi","STKaiti","LXGW WenKai Screen",sans-serif; font-size:16rpx; line-height:1.24; }
.pinned__questions > view:last-child { border-bottom:0; }
.pinned__questions > view > text:first-child { color:#222; font-weight:700; }
.pinned__qa-copy { display:flex; min-width:0; flex-direction:column; gap:3rpx; }
.pinned__qa-copy text { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pinned__qa-copy text:first-child { color:#30332e; }
.pinned__qa-copy text:last-child { color:#666255; }
.pinned__cta { position:absolute; z-index:3; right:4rpx; bottom:12rpx; height:60rpx; padding:0 26rpx; color:white; border-radius:999rpx; background:var(--tago-primary); box-shadow:0 8rpx 18rpx rgba(32,88,79,.13); font-size:21rpx; line-height:60rpx; transition:transform .2s ease,background .2s ease; }
.pinned__cta::after { border:0; }
.pinned__cta:active { background:var(--tago-primary-strong); transform:translateY(1px) scale(.98); }

@media (max-width:430px) {
  .pinned { grid-template-columns:50% 50%; min-height:230px; margin-top:14px; padding:40px 13px 14px 16px; }
  .pinned__label { top:0; left:12px; padding:6px 12px; font-size:14px; }
  .pinned__price { top:10px; right:13px; font-size:24px; }
  .pinned__person { gap:7px; }
  .pinned__name { font-size:13px; }
  .pinned__meta { font-size:10px; }
  .pinned__title { margin-top:14px; font-size:18px; letter-spacing:.5px; }
  .pinned__summary { margin-top:6px; font-size:11px; line-height:1.45; }
  .pinned__labels { gap:5px; margin-top:9px; font-size:9px; }
  .pinned__books { right:-4px; bottom:-3px; width:70px; height:53px; }
  .pinned__questions { margin:0 0 49px 4px; padding:6px 8px; }
  .pinned__questions > view { grid-template-columns:23px minmax(0,1fr); gap:2px; padding:5px 0; font-size:9px; line-height:1.24; }
  .pinned__cta { right:3px; bottom:8px; height:38px; padding:0 15px; font-size:12px; line-height:38px; }
}
</style>
