<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { shallowRef } from 'vue'
import AuthEntryPage from '@/components/auth/AuthEntryPage.vue'

const redirect = shallowRef('/pages/discover/index')

onLoad((query) => {
  if (typeof query?.redirect === 'string' && query.redirect.startsWith('/pages/')) redirect.value = decodeURIComponent(query.redirect)
})
</script>

<template>
  <AuthEntryPage initial-mode="register" :redirect="redirect" />
</template>
