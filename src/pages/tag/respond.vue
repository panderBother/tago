<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, reactive, shallowRef } from 'vue'
import type { TagDto } from '@/api/social'
import { durationLabel } from '@/api/adapters'
import { getPublicTag, submitApplication } from '@/api/social'
import AppHeader from '@/components/business/AppHeader.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
const tag=shallowRef<TagDto|null>(null),answers=reactive<Record<number,string>>({}),loading=shallowRef(true),submitting=shallowRef(false),error=shallowRef('')
const questions=computed(()=>tag.value?.questions.filter(q=>q.generated&&q.text)||[]),canSend=computed(()=>questions.value.length===3&&questions.value.every(q=>answers[q.slot]?.trim()))
const questionStickers=['/static/stickers/sticker-book.png','/static/stickers/sticker-moon.png','/static/stickers/sticker-camera.png']
async function load(id:string){loading.value=true;error.value='';try{tag.value=await getPublicTag(id)}catch(cause){error.value=cause instanceof Error?cause.message:'Tag 加载失败'}finally{loading.value=false}}
async function send(){if(!tag.value||!canSend.value||submitting.value)return;submitting.value=true;try{await submitApplication(tag.value.id,{answers:questions.value.map(q=>({slot:q.slot,questionVersion:q.questionVersion,text:answers[q.slot].trim()}))});uni.showToast({title:'认识申请已发送',icon:'success'});setTimeout(()=>uni.reLaunch({url:'/pages/meet/index'}),500)}finally{submitting.value=false}}
function goBack(){uni.navigateBack()} onLoad(q=>{const id=typeof q?.id==='string'?q.id:'';if(id)load(id);else{loading.value=false;error.value='缺少 Tag ID'}})
</script>
<template><view class="tago-page tago-page--detail respond-page"><AppHeader back title="回应这个 Tag" subtitle="认真回答，是认识彼此的开始" @back="goBack"/><AsyncState :loading="loading" :error="error" :empty="!tag" empty-title="没有找到这个 Tag" @retry="tag&&load(tag.id)"><section v-if="tag" class="tag-note"><text class="owner">{{ tag.ownerIdentity.displayName }} · @{{ tag.ownerIdentity.publicId }}</text><h1># {{ tag.body }}</h1><text class="meta">{{ tag.encounterMode==='ONLINE'?'线上':tag.encounterMode==='OFFLINE'?'线下':'线上或线下' }} · {{ durationLabel(tag.duration) }}</text><image src="/static/stickers/books.png" mode="aspectFit"/></section><section v-if="questions.length" class="answer-list"><article v-for="q in questions" :key="q.slot" class="answer-card" :class="`answer-card--${q.slot}`"><image class="answer-card__sticker" :src="questionStickers[q.slot-1]" mode="aspectFit"/><view><b>Q{{ q.slot }}</b><text>{{ q.text }}</text></view><textarea v-model="answers[q.slot]" maxlength="200" placeholder="写下你的真实回答…"/><small>{{ Array.from(answers[q.slot]||'').length }}/200</small></article></section><view v-else-if="tag" class="no-questions">这个 Tag 暂时没有完整的问题，暂不能提交申请。</view><button class="send" :disabled="!canSend||submitting" :loading="submitting" @click="send">发送认识申请</button></AsyncState></view></template>
<style scoped lang="scss">
.respond-page {
  background:
    repeating-linear-gradient(0deg, rgba(32,88,79,.02) 0 1px, transparent 1px 8px),
    linear-gradient(180deg, #f8f4e9 0%, #f4efdf 100%);
}

.tag-note {
  position:relative;
  padding:29rpx 32rpx;
  border:1rpx solid rgba(184,151,97,.13);
  border-radius:18rpx 32rpx 16rpx;
  background:
    repeating-linear-gradient(117deg, rgba(184,151,97,.06) 0 2px, transparent 2px 10px),
    linear-gradient(112deg, #fdf6de 0%, #faecc7 58%, #f8e7bd 100%);
  box-shadow:0 11rpx 25rpx rgba(84,66,27,.12);
  transform:rotate(-.4deg);
}

.tag-note::before {
  content:'';
  position:absolute;
  top:15rpx;
  right:24rpx;
  width:64rpx;
  height:15rpx;
  border-radius:0 0 4rpx 4rpx;
  background:rgba(255,252,240,.45);
  transform:rotate(-4deg);
}

.tag-note .owner, .tag-note .meta { color:rgba(42,55,48,.66); font-size:19rpx; }
.tag-note h1 { margin:17rpx 0; color:#1f241f; font-size:34rpx; line-height:1.45; }
.tag-note>image { position:absolute; right:20rpx; bottom:-13rpx; width:132rpx; height:100rpx; opacity:.9; transform:rotate(4deg); }
.tag-note h1,.tag-note .meta { display:block; padding-right:118rpx; }

.answer-list {
  display:flex;
  flex-direction:column;
  gap:15rpx;
  margin-top:22rpx;
}

.answer-card {
  position:relative;
  padding:21rpx;
  border:1rpx solid rgba(32,88,79,.075);
  border-radius:18rpx 28rpx 16rpx;
  background:
    repeating-linear-gradient(116deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px),
    linear-gradient(155deg, #eff7e9 0%, #e2eed9 100%);
  box-shadow:0 8rpx 18rpx rgba(39,68,56,.06);
}
.answer-card__sticker { position:absolute; z-index:1; top:10rpx; right:13rpx; width:72rpx; height:62rpx; opacity:.8; }
.answer-card>view { padding-right:65rpx; }

.answer-card--2 {
  background:
    repeating-linear-gradient(116deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px),
    linear-gradient(155deg, #f0f8fb 0%, #e0eef6 100%);
}

.answer-card--3 {
  background:
    repeating-linear-gradient(116deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px),
    linear-gradient(155deg, #fbf2d8 0%, #f5e5b4 100%);
}

.answer-card>view {
  display:grid;
  grid-template-columns:52rpx 1fr;
  align-items:start;
  gap:6rpx;
}

.answer-card b { color:#20584f; font-size:26rpx; }
.answer-card>view text { color:#20241f; font-size:23rpx; font-weight:800; line-height:1.5; }
.answer-card textarea {
  width:100%;
  height:118rpx;
  margin-top:12rpx;
  padding:16rpx;
  border:1rpx solid rgba(255,255,255,.68);
  border-radius:16rpx;
  background:rgba(255,253,246,.88);
  color:#252a24;
  font-size:22rpx;
  line-height:1.55;
}

.answer-card small {
  display:block;
  margin-top:6rpx;
  color:#6c7269;
  font-size:17rpx;
  text-align:right;
}

.send {
  height:82rpx;
  margin:24rpx 0;
  color:#fff;
  border-radius:999rpx;
  background:linear-gradient(180deg, #245f56 0%, #20584f 100%);
  box-shadow:0 10rpx 22rpx rgba(32,88,79,.16);
  font-size:27rpx;
  font-weight:850;
  line-height:80rpx;
}

.send::after { border:0; }
.send[disabled] { opacity:.48; }
.no-questions { padding:80rpx 25rpx; color:var(--tago-muted); text-align:center; }
</style>
