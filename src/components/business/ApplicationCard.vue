<script setup lang="ts">
import { computed } from 'vue'
import type { ApplicationItem } from '@/types/models'
import AvatarBadge from './AvatarBadge.vue'
const props = defineProps<{ application: ApplicationItem }>()
const emit = defineEmits<{ accept:[id:string]; decline:[id:string]; detail:[id:string] }>()
// 后端没有独立附言字段，message 取自第一条回答；与 Q1 重复时不再单独展示
const showMessage = computed(() => Boolean(props.application.message) && props.application.message !== props.application.answers[0]?.answer)
</script>

<template>
  <view class="application" :class="`application--${application.tone}`">
    <view class="application__head"><AvatarBadge :user="application.applicant" /><view class="application__identity"><text class="application__name">{{ application.applicant.name }}</text><text>{{ application.applicant.city }} · {{ application.timeLabel }}</text></view></view>
    <text class="application__reason">TA 想因为 <b>{{ application.tagTitle }}</b> 认识你</text><text v-if="showMessage" class="application__message">{{ application.message }}</text>
    <view class="application__answers"><view v-for="(item,index) in application.answers" :key="item.id"><text class="application__q">Q{{ index + 1 }}　{{ item.question }}</text><text class="application__a">A：{{ item.answer }}</text></view></view>
    <view class="application__actions"><button class="tago-outline-button" @click="emit('detail',application.id)">看看TA →</button><button class="tago-primary-button" data-testid="accept-button" @click="emit('accept',application.id)">♥ 接受认识</button><button class="application__decline" @click="emit('decline',application.id)">暂时不了</button></view>
  </view>
</template>

<style scoped lang="scss">
.application {
  position:relative;
  height:320rpx;
  margin-bottom:14rpx;
  padding:16rpx 20rpx 18rpx;
  overflow:hidden;
  border:1rpx solid rgba(32,88,79,.08);
  border-radius:10rpx 25rpx 12rpx 20rpx;
  box-shadow:0 9rpx 22rpx rgba(39,68,56,.08);
}

.application::before {
  content:'';
  position:absolute;
  inset:0;
  background:repeating-linear-gradient(116deg, rgba(255,255,255,.13) 0 2px, transparent 2px 9px);
  pointer-events:none;
}

.application--yellow { background:linear-gradient(157deg, #fdf8e8 0%, #f9efd5 58%, #f8eaca 100%); }
.application--blue { background:linear-gradient(157deg, #f7fafb 0%, #edf3f7 58%, #e5eef4 100%); }
.application--green { background:linear-gradient(157deg, #f8faf4 0%, #f0f4e9 58%, #ecf1e3 100%); }

.application__head { position:relative; display:flex; align-items:center; gap:11rpx; }
.application__identity { display:flex; flex:1; flex-direction:column; color:#656c65; font-size:17rpx; }
.application__name { color:#20241f; font-size:25rpx; font-weight:870; }

.application__reason {
  position:relative;
  display:block;
  overflow:hidden;
  margin-top:9rpx;
  padding:7rpx 12rpx;
  border:1rpx solid rgba(214,175,67,.24);
  border-radius:9rpx;
  background:rgba(255,252,237,.52);
  color:#20241f;
  font-size:20rpx;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.application__message {
  position:relative;
  display:block;
  overflow:hidden;
  margin:8rpx 4rpx;
  color:#565e56;
  font-size:17rpx;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.application__answers {
  position:relative;
  padding:7rpx 12rpx;
  border:1rpx solid rgba(255,255,255,.5);
  border-radius:11rpx;
  background:rgba(255,253,245,.62);
}

.application__answers view {
  display:grid;
  grid-template-columns:1fr 1.45fr;
  gap:8rpx;
  padding:5rpx 0;
  border-bottom:1rpx dashed rgba(32,88,79,.11);
}

.application__answers view:last-child { border-bottom:0; }
.application__q, .application__a {
  display:block;
  overflow:hidden;
  font-size:16rpx;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.application__q { color:#242820; font-weight:760; }
.application__a { color:#5e665f; }

.application__actions {
  position:relative;
  display:flex;
  align-items:center;
  gap:8rpx;
  margin-top:11rpx;
}

.application__actions button {
  flex:1;
  min-height:48rpx;
  padding:0 10rpx;
  font-size:17rpx;
  line-height:46rpx;
}

.application__decline {
  color:#4b534d;
  border-radius:999rpx;
  background:rgba(255,253,245,.62);
}
</style>
