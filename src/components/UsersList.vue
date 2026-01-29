<template>
  <v-list lines="three" class="overflow-y-auto" style="height: 100vh; padding: 0;">
    <v-card width="100%" elevation="0">
      <v-card-text>
        <v-text-field v-model="searchInputValue" label="User Name" placeholder="Name" prepend-inner-icon="mdi-magnify"
          variant="outlined" />
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <h2 class="pl-4">{{ listTitle }}</h2>
    <user-item v-for="user in filteredUsers" :key="user.uid" :to="'/chat/' + user.uid" :userName="user.userName"
      :messages="user.messages?.at(-1)?.text || ''" :avatar="user.avatar" />
  </v-list>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'
import { useUserStore } from '@/store/user.js'
import { getAuth, onAuthStateChanged } from "firebase/auth"

const userStore = useUserStore()
const auth = getAuth()

const currentUid = ref('')

const props = defineProps({
  filterType: {
    type: String,
    required: true
  },
})

const searchInputValue = ref('')

onMounted(() => {
  onAuthStateChanged(auth, user => {
    if (user) currentUid.value = user.uid
  })
})

const filteredUsers = computed(() => {
  if (!currentUid.value) return []
  let users = userStore.users.filter(u => u.uid !== currentUid.value)
  if (props.filterType === 'friends') {
    users = users.filter(u => userStore.friends.includes(u.uid))
  }
  if (searchInputValue.value) {
    const search = searchInputValue.value.toLowerCase()
    users = users.filter(u => u.email.toLowerCase().includes(search))
  }

  return users
})

const listTitle = computed(() => {
  if (props.filterType === 'all') return 'All Users'
  if (props.filterType === 'friends') return 'Friends'
  return ''
})

</script>

