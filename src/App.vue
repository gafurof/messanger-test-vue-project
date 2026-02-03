<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user'

const store = useUserStore()

onMounted(() => {
  store.fetchUsers()
})
</script>

<style>
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

body::-webkit-scrollbar {
  display: none;
}
</style>
