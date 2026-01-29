<template>
  <v-toolbar color="primary">
    <template #prepend>
      <v-btn icon="mdi-arrow-left" :to="'/'" />
      <v-img :width="40" rounded="circle" aspect-ratio="1/1" :src="avatar" class="mr-2"></v-img>
      <h3>{{ userName }}</h3>
    </template>
    <modal-user-info></modal-user-info>
  </v-toolbar>
</template>

<script setup>
import { defineProps } from 'vue'
import ModalUserInfo from './ModalUserInfo.vue';

const props = defineProps({
  userName: String,
  avatar: String
})
</script>