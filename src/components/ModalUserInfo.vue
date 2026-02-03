<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Add friend" variant="tonal"
          v-bind="activatorProps"></v-btn>
      </template>

      <v-card prepend-icon="mdi-account" title="User Profile">
          <v-btn class="ma-1" color="primary" text="Add Firend" variant="tonal" @click="addFriend"></v-btn>
          <v-btn class="ma-1" color="red" text="Remove Firend" variant="tonal" @click="removeFriend"></v-btn>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useUserStore()
const dialog = ref(false)

function addFriend() {
  const user = store.users.find(u => u.uid === store.currentUser.uid)
  const friend = store.users.find(u => u.uid === route.params.uid)
  store.addFriend(user.id, friend.uid, friend.email, friend.userName, friend.messages, friend.avatar, friend.id)
  dialog.value = false
}

function removeFriend() {
  const user = store.users.find(u => u.uid === store.currentUser.uid)
  const friend = store.users.find(u => u.uid === route.params.uid)
  store.removeFriend(user.id, friend.uid)
  dialog.value = false
}
</script>
