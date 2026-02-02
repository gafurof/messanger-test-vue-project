<template>
  <v-sheet height="100vh" class="d-flex flex-column">
    <v-sheet class="pa-2">
      <v-text-field v-model="searchInputValue" label="User Name" prepend-inner-icon="mdi-magnify" variant="outlined"
        density="comfortable" />
    </v-sheet>
    <h2 class="pl-4">{{ listTitle }}</h2>
    <v-list class="flex-grow-1 overflow-y-auto" lines="three">
      <user-item v-for="user in filteredUsers" :key="user.uid" :to="'/chat/' + user.uid" :userName="user.userName"
        :messages="user.messages?.at(-1)?.text || ''" :avatar="user.avatar" />
    </v-list>

  </v-sheet>

</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'
import { useUserStore } from '@/store/user.js'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const userStore = useUserStore()
const auth = getAuth()

const currentUid = ref('')
const searchInputValue = ref('')

const props = defineProps({
  filterType: {
    type: String,
    required: true
  }
})

onMounted(() => {
  onAuthStateChanged(auth, user => {
    if (user) {
      currentUid.value = user.uid
    }
  })
})

const currentUser = computed(() => {
  if (!currentUid.value) return null
  return userStore.users.find(u => u.uid === currentUid.value) || null
})

const filteredUsers = computed(() => {
  if (!currentUid.value || !userStore.users.length) return []

  let users = []

  if (props.filterType === 'friends') {
    users = currentUser.value?.friends || []
  } else {
    users = userStore.users.filter(u => u.uid !== currentUid.value)
  }

  if (searchInputValue.value) {
    const search = searchInputValue.value.toLowerCase()
    users = users.filter(
      u => u.userName && u.userName.toLowerCase().includes(search)
    )
  }

  return users
})

const listTitle = computed(() => {
  if (props.filterType === 'all') return 'All Users'
  if (props.filterType === 'friends') return 'Friends'
  return ''
})
</script>
