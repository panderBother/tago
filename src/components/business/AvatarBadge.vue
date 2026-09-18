<script setup lang="ts">
import { computed } from 'vue'
import type { UserSummary } from '@/types/models'
const props = defineProps<{ user: UserSummary; size?: 'sm' | 'md' | 'lg' }>()
const prototypeSource = computed(() => props.user.id.startsWith('m') ? '/static/prototypes/meet.jpg' : '/static/prototypes/discover.jpg')
const croppedAvatarSource = computed(() => props.user.id.startsWith('u') ? `/static/avatars/${props.user.id}.png` : '')
const hasCroppedAvatar = computed(() => /^u[0-6]$/.test(props.user.id))
const hasPrototype = computed(() => /^(u[0-6]|m\d)$/.test(props.user.id))
</script>

<template>
  <view class="avatar" :class="[`avatar--${size ?? 'md'}`, `avatar--${user.id}`]" :aria-label="`${user.name}的头像`">
    <image v-if="hasCroppedAvatar" class="avatar__photo" :src="croppedAvatarSource" mode="aspectFill" />
    <image v-else-if="hasPrototype" class="avatar__prototype" :src="prototypeSource" mode="widthFix" />
    <text v-else>{{ user.avatar }}</text>
  </view>
</template>

<style scoped lang="scss">
.avatar { position: relative; flex: none; overflow: hidden; border: 4rpx solid rgba(255,255,255,.96); border-radius: 50%; color: white; background: #90a99f; box-shadow: 0 3rpx 10rpx rgba(35,72,60,.16); }
.avatar__photo { position:absolute; inset:0; width:100%; height:100%; }
.avatar__prototype { position: absolute; left: -42rpx; width: 750rpx; max-width: none; height: auto; }
.avatar--u0 .avatar__prototype { top: -334rpx; }.avatar--u1 .avatar__prototype { top: -644rpx; }.avatar--u2 .avatar__prototype { top: -747rpx; }.avatar--u3 .avatar__prototype { top: -849rpx; }.avatar--u4 .avatar__prototype { top: -950rpx; }.avatar--u5 .avatar__prototype { top: -1052rpx; }.avatar--u6 .avatar__prototype { top: -1153rpx; }
.avatar--m1 .avatar__prototype { top:-430rpx; }.avatar--m2 .avatar__prototype { top:-526rpx; }.avatar--m3 .avatar__prototype { top:-619rpx; }.avatar--m4 .avatar__prototype { top:-706rpx; }.avatar--m5 .avatar__prototype { top:-793rpx; }.avatar--m6 .avatar__prototype { top:-883rpx; }.avatar--m7 .avatar__prototype { top:-970rpx; }.avatar--m8 .avatar__prototype { top:-1057rpx; }.avatar--m9 .avatar__prototype { top:-1147rpx; }
.avatar--sm { width:58rpx; height:58rpx; font-size:20rpx; }.avatar--md { width:66rpx; height:66rpx; font-size:23rpx; }.avatar--lg { width:76rpx; height:76rpx; font-size:27rpx; }
.avatar--lg .avatar__prototype { left:-49rpx; width:875rpx; }.avatar--lg.avatar--u0 .avatar__prototype { top:-390rpx; }.avatar--lg.avatar--u1 .avatar__prototype { top:-751rpx; }.avatar--lg.avatar--u2 .avatar__prototype { top:-871rpx; }.avatar--lg.avatar--u3 .avatar__prototype { top:-990rpx; }.avatar--lg.avatar--u4 .avatar__prototype { top:-1108rpx; }.avatar--lg.avatar--u5 .avatar__prototype { top:-1227rpx; }.avatar--lg.avatar--u6 .avatar__prototype { top:-1345rpx; }
</style>
