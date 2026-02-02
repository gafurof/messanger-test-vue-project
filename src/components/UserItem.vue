<template>
  <router-link :to="to" style="text-decoration: none; color: inherit; width: 100%;">
    <v-list-item  link :value="id" width="100%" :title="userName" :subtitle="messages" :prepend-avatar="avatar" />
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  id: [String, Number],
  userName: String,
  messages: String,
  avatar: String,
  to: String
})
</script>
