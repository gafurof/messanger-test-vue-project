<template>
  <div class="d-flex flex-column w-100">
    <v-card rounded="0">
      <v-toolbar color="primary">
        <v-tabs align-tabs="center">
          <v-tab @click="filterType = 'all'">All</v-tab>
          <v-tab @click="filterType = 'friends'">Friends</v-tab>
          <v-divider class="mx-3 align-self-center" length="24" thickness="2" vertical />
          <modal-user-settings></modal-user-settings>
        </v-tabs>
      </v-toolbar>
    </v-card>
    <v-main>
      <users-list height="90vh" :filterType="filterType" />
    </v-main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const filterType = ref('all')
const auth = getAuth()
const userId = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid
    } else {
      userId.value = null
    }
  })
})
</script>
