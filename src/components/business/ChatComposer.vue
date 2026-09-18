<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  connected: boolean
  sending: boolean
  error?: string
}>()

const emit = defineEmits<{
  gift: []
  send: []
}>()

const draft = defineModel<string>({ default: '' })
const canSend = computed(() => props.connected && !props.sending && Boolean(draft.value.trim()))
</script>

<template>
  <view class="chat-composer">
    <text v-if="error" class="chat-composer__error" role="alert">{{ error }}</text>
    <view class="chat-composer__row">
      <button class="chat-composer__gift" aria-label="送礼物" @click="emit('gift')">🎁</button>
      <textarea
        v-model="draft"
        class="chat-composer__input"
        :disabled="!connected"
        maxlength="1000"
        auto-height
        :placeholder="connected ? '输入消息…' : '聊天服务连接后可发送'"
      />
      <button
        class="chat-composer__send"
        :disabled="!canSend"
        :loading="sending"
        @click="emit('send')"
      >
        发送
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.chat-composer {
  flex: none;
  padding: 12rpx 4rpx calc(18rpx + env(safe-area-inset-bottom));
  border-top: 1px solid var(--tago-line);
  background: linear-gradient(180deg, rgba(239, 241, 234, .96), #e9ebe4 32%);
}

.chat-composer__error {
  display: block;
  margin: 0 4rpx 10rpx;
  padding: 9rpx 14rpx;
  color: #9d463d;
  border-radius: 12rpx;
  background: rgba(236, 203, 190, .48);
  font-size: 17rpx;
  line-height: 1.4;
}

.chat-composer__row {
  display: grid;
  grid-template-columns: 72rpx minmax(0, 1fr) 100rpx;
  align-items: end;
  gap: 13rpx;
}

.chat-composer__gift,
.chat-composer__send {
  display: grid;
  width: 100%;
  min-width: 0;
  height: 72rpx;
  margin: 0;
  padding: 0;
  place-items: center;
  border: 0;
  line-height: 1;
}

.chat-composer__gift::after,
.chat-composer__send::after { border: 0; }

.chat-composer__gift {
  color: #fff;
  border-radius: 50%;
  background: var(--tago-primary);
  box-shadow: 0 7rpx 16rpx rgba(32, 88, 79, .18);
  font-size: 28rpx;
}

.chat-composer__input {
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 76rpx;
  max-height: 190rpx;
  padding: 18rpx 23rpx;
  border: 1rpx solid rgba(32, 88, 79, .07);
  border-radius: 28rpx;
  background: #fffdf6;
  box-shadow: 0 6rpx 16rpx rgba(39, 68, 56, .06);
  font-size: 22rpx;
  line-height: 1.5;
}

.chat-composer__send {
  color: #fff;
  border-radius: 999rpx;
  background: var(--tago-primary);
  box-shadow: 0 7rpx 16rpx rgba(32, 88, 79, .16);
  font-size: 21rpx;
  font-weight: 800;
}

.chat-composer__gift[disabled],
.chat-composer__send[disabled] {
  box-shadow: none;
  opacity: .45;
}
</style>
