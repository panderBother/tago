<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, reactive, shallowRef } from 'vue'
import type { TagDto } from '@/api/social'
import { createTag, customizeTagQuestion, customizeTagQuestions, editTagBody, generateTagQuestions, getMyTag, publishTag, refreshTagQuestion, savePublisherAnswer } from '@/api/social'
import AppHeader from '@/components/business/AppHeader.vue'
import AsyncState from '@/components/ui/AsyncState.vue'

const body=shallowRef(''),duration=shallowRef<'DAY'|'WEEK'|'MONTH'|'LONG_TERM'>('WEEK'),encounterMode=shallowRef<'ONLINE'|'OFFLINE'|'BOTH'>('BOTH')
const draft=shallowRef<TagDto|null>(null),answers=reactive<Record<number,string>>({}),questionEdits=reactive<Record<number,string>>({}),loading=shallowRef(false),working=shallowRef(false),error=shallowRef('')
const questions=computed(()=>draft.value?.questions.filter(q=>q.generated&&q.text)||[])
const canPublish=computed(()=>body.value.trim().length>=4&&questions.value.length===3&&questions.value.every(q=>answers[q.slot]?.trim()))
async function load(){loading.value=true;error.value='';try{const mine=await getMyTag();draft.value=mine.draft;if(mine.draft){body.value=mine.draft.body;duration.value=mine.draft.duration;encounterMode.value=mine.draft.encounterMode;for(const q of mine.draft.questions)questionEdits[q.slot]=q.text||'';for(const a of mine.draft.publisherAnswers)answers[a.slot]=a.text}}catch(cause){error.value=cause instanceof Error?cause.message:'草稿加载失败'}finally{loading.value=false}}
async function ensureDraft(){let value=draft.value;if(!value)value=await createTag({body:body.value.trim(),duration:duration.value,encounterMode:encounterMode.value});else if(value.body!==body.value.trim())value=await editTagBody(value.id,{body:body.value.trim(),expectedVersion:value.version});draft.value=value;return value}
async function generate(){if(body.value.trim().length<4)return uni.showToast({title:'先写下至少 4 个字',icon:'none'});working.value=true;try{let value=await ensureDraft();if(value.questions.some(q=>q.generated)){for(const q of value.questions.filter(item=>item.generated&&item.refreshCount<5))value=await refreshTagQuestion(value.id,q.slot,value.version)}else value=await generateTagQuestions(value.id,value.version);draft.value=value;for(const q of value.questions)questionEdits[q.slot]=q.text||''}finally{working.value=false}}
async function refreshQuestion(slot:number){if(!draft.value)return;working.value=true;try{draft.value=await refreshTagQuestion(draft.value.id,slot,draft.value.version);const q=draft.value.questions.find(item=>item.slot===slot);questionEdits[slot]=q?.text||'';answers[slot]=''}finally{working.value=false}}
async function saveQuestion(slot:number){if(!draft.value)return;const q=draft.value.questions.find(item=>item.slot===slot);const text=questionEdits[slot]?.trim();if(!q?.customizationUnlocked||!text||text===q.text)return;draft.value=await customizeTagQuestion(draft.value.id,slot,{expectedVersion:draft.value.version,text});answers[slot]='';uni.showToast({title:'问题已更新',icon:'none'})}
async function saveAllQuestions(){if(!draft.value||questions.value.length!==3)return;const values=[1,2,3].map(slot=>questionEdits[slot]?.trim()||'');if(values.some(value=>!value))return uni.showToast({title:'请先补全三个问题',icon:'none'});working.value=true;try{draft.value=await customizeTagQuestions(draft.value.id,{expectedVersion:draft.value.version,question1:values[0]!,question2:values[1]!,question3:values[2]!});uni.showToast({title:'三个问题已一起保存',icon:'none'})}finally{working.value=false}}
async function publish(){if(!canPublish.value||!draft.value||working.value)return;working.value=true;try{let value=await ensureDraft();for(const q of value.questions){value=await savePublisherAnswer(value.id,q.slot,{expectedVersion:value.version,questionVersion:q.questionVersion,text:answers[q.slot].trim()})}await publishTag(value.id,value.version);uni.showToast({title:'Tag 发布成功',icon:'success'});setTimeout(()=>uni.reLaunch({url:'/pages/discover/index'}),500)}finally{working.value=false}}
function goBack(){uni.navigateBack()} onShow(load)
</script>
<template><view class="tago-page tago-page--detail compose-page"><AppHeader back title="发一个 Tag" subtitle="写下一张此刻想递给陌生人的小纸条" @back="goBack"/><AsyncState :loading="loading" :error="error" @retry="load"><section class="paper tag-paper"><text class="tape">✎ 写下你的 Tag</text><textarea v-model="body" maxlength="100" placeholder="此刻你想和怎样的人发生什么？"/><text class="counter">{{ Array.from(body).length }}/100</text><view class="choices"><label><text>有效期</text><picker :range="['一天','本周','30 天','长期']" :value="['DAY','WEEK','MONTH','LONG_TERM'].indexOf(duration)" @change="duration=(['DAY','WEEK','MONTH','LONG_TERM'] as const)[$event.detail.value]"><view>{{ {DAY:'一天',WEEK:'本周',MONTH:'30 天',LONG_TERM:'长期'}[duration] }} ›</view></picker></label><label><text>相遇方式</text><picker :range="['线上','线下','都可以']" :value="['ONLINE','OFFLINE','BOTH'].indexOf(encounterMode)" @change="encounterMode=(['ONLINE','OFFLINE','BOTH'] as const)[$event.detail.value]"><view>{{ {ONLINE:'线上',OFFLINE:'线下',BOTH:'都可以'}[encounterMode] }} ›</view></picker></label></view></section><section class="question-section"><view class="section-head"><view><text>AI 为你生成三个问题</text><small>问题和回答都会来自真实服务</small></view><view class="section-head__actions"><button v-if="questions.length" :disabled="working" @click="saveAllQuestions">保存三题</button><button :loading="working" @click="generate">{{ questions.length?'重新生成':'生成问题' }}</button></view></view><view v-if="questions.length" class="question-list"><article v-for="question in questions" :key="question.slot" class="question-card" :class="`question-card--${question.slot}`"><view class="question-line"><b>Q{{ question.slot }}</b><input v-model="questionEdits[question.slot]" :disabled="!question.customizationUnlocked" maxlength="80" @blur="saveQuestion(question.slot)"/></view><textarea v-model="answers[question.slot]" maxlength="200" placeholder="认真写下你的回答…"/><view class="question-actions"><text>{{ Array.from(answers[question.slot]||'').length }}/200</text><button :disabled="question.refreshCount>=5||working" @click="refreshQuestion(question.slot)">换一题 {{ question.refreshCount }}/5</button></view></article></view><view v-else class="question-empty">写完 Tag 后生成问题，这里不会再出现预设答案。</view></section><button class="publish" :disabled="!canPublish||working" :loading="working" @click="publish">发送这张 Tag 纸条</button></AsyncState></view></template>
<style scoped lang="scss">
.compose-page {
  overflow-x:hidden;
  background:
    repeating-linear-gradient(0deg, rgba(32,88,79,.02) 0 1px, transparent 1px 8px),
    linear-gradient(180deg, #f8f4e9 0%, #f4efdf 100%);
}

.paper {
  position:relative;
  padding:47rpx 26rpx 24rpx;
  border:1rpx solid rgba(184,151,97,.12);
  border-radius:14rpx 24rpx 18rpx;
  background:
    repeating-linear-gradient(117deg, rgba(184,151,97,.05) 0 2px, transparent 2px 10px),
    linear-gradient(114deg, #fffbe9 0%, #faf0cd 60%, #f7e9bb 100%);
  box-shadow:0 11rpx 25rpx rgba(84,66,27,.12);
}

.tape {
  position:absolute;
  top:-12rpx;
  left:20rpx;
  padding:11rpx 24rpx;
  background:linear-gradient(180deg, rgba(255,252,235,.42), rgba(244,201,76,.82));
  font-size:24rpx;
  font-weight:900;
  transform:rotate(-2deg);
}

.tag-paper textarea {
  width:100%;
  height:154rpx;
  padding:18rpx;
  border:1rpx solid rgba(255,255,255,.7);
  border-radius:18rpx;
  background:rgba(255,253,246,.86);
  color:#232823;
  font-size:28rpx;
  line-height:1.6;
}

.counter {
  display:block;
  margin:6rpx 2rpx;
  color:#6c7269;
  font-size:18rpx;
  text-align:right;
}

.choices {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12rpx;
}

.choices label {
  padding:14rpx 18rpx;
  border:1rpx solid rgba(255,255,255,.45);
  border-radius:17rpx;
  background:rgba(226,239,224,.52);
}

.choices label>text { display:block; color:#697067; font-size:18rpx; }
.choices picker { margin-top:3rpx; color:#20584f; font-size:22rpx; font-weight:820; }
.question-section { margin-top:22rpx; }
.section-head {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14rpx;
  margin-bottom:14rpx;
}

.section-head>view { display:flex; flex-direction:column; }
.section-head>.section-head__actions { flex-direction:row; gap:8rpx; }
.section-head text { color:#20241f; font-size:27rpx; font-weight:900; }
.section-head small { margin-top:4rpx; color:#6c7269; font-size:18rpx; }
.section-head button {
  flex:none;
  height:54rpx;
  padding:0 20rpx;
  color:#274f47;
  border:1rpx solid rgba(214,175,67,.26);
  border-radius:999rpx;
  background:linear-gradient(180deg, #fdf4ce, #f3dd94);
  font-size:19rpx;
  line-height:52rpx;
}

.section-head button::after,
.question-actions button::after,
.publish::after { border:0; }
.question-list { display:flex; flex-direction:column; gap:12rpx; }

.question-card {
  padding:18rpx;
  border:1rpx solid rgba(32,88,79,.07);
  border-radius:18rpx 28rpx 16rpx;
  background:
    repeating-linear-gradient(116deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px),
    linear-gradient(155deg, #eff7e9 0%, #e1eed8 100%);
  box-shadow:0 7rpx 16rpx rgba(39,68,56,.055);
}

.question-card--2 {
  background:
    repeating-linear-gradient(116deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px),
    linear-gradient(155deg, #f0f8fb 0%, #dfedf5 100%);
}

.question-card--3 {
  background:
    repeating-linear-gradient(116deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px),
    linear-gradient(155deg, #fbf2d8 0%, #f4e3b1 100%);
}

.question-line {
  display:grid;
  grid-template-columns:52rpx 1fr;
  align-items:center;
}

.question-line b { color:#20584f; font-size:26rpx; }
.question-line input {
  height:52rpx;
  padding:0 12rpx;
  color:#232823;
  font-size:22rpx;
  font-weight:810;
}

.question-card textarea {
  width:100%;
  height:104rpx;
  margin-top:8rpx;
  padding:14rpx;
  border:1rpx solid rgba(255,255,255,.7);
  border-radius:15rpx;
  background:rgba(255,253,246,.88);
  color:#252a24;
  font-size:21rpx;
  line-height:1.52;
}

.question-actions {
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-top:6rpx;
  color:#6c7269;
  font-size:17rpx;
}

.question-actions button {
  height:44rpx;
  padding:0 15rpx;
  color:#20584f;
  border:0;
  background:transparent;
  font-size:18rpx;
  line-height:42rpx;
}

.question-empty {
  padding:64rpx 28rpx;
  color:var(--tago-muted);
  border:2rpx dashed rgba(32,88,79,.15);
  border-radius:24rpx;
  text-align:center;
  font-size:21rpx;
  line-height:1.65;
}

.publish {
  height:76rpx;
  margin:22rpx 0;
  color:#fff;
  border-radius:999rpx;
  background:linear-gradient(180deg, #245f56 0%, #20584f 100%);
  box-shadow:0 10rpx 22rpx rgba(32,88,79,.16);
  font-size:27rpx;
  font-weight:850;
  line-height:74rpx;
}

.publish[disabled] { opacity:.5; }

@media(max-width:360px) {
  .section-head { align-items:flex-start; flex-direction:column; }
  .choices { grid-template-columns:1fr; }
}
</style>
