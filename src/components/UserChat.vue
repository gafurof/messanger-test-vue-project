<template>
  <div class="w-100" v-if="user">
    <user-bar :avatar="user.avatar" :userName="user.userName"></user-bar>
    <v-sheet height="90vh" class="d-flex flex-column" style="border-left: 1px solid #DCDCDC;">
      <v-sheet ref="chatContainer" class="flex-grow-1 overflow-y-auto pa-4">
        <div v-for="msg in user.messages || []" :key="msg.id" class="d-flex mb-2"
          :class="msg.fromMe ? 'justify-end' : 'justify-start'">
          <v-sheet  class="pa-3 mobile" :class="msg.fromMe ? 'forMe' : 'forYou'"
            :color="msg.fromMe ? 'primary' : 'grey-lighten-3'" :text-color="msg.fromMe ? 'white' : 'black'">
            <div>{{ msg.text }}</div>
            <div class="text-caption" :class="msg.fromMe ? 'text-right' : 'text-left'">
              {{ msg.hour }}
            </div>
          </v-sheet>
        </div>
      </v-sheet>

      <v-sheet class="pa-3 d-flex align-center ga-3">
        <v-text-field v-model="newMessage" placeholder="Xabar yozing..." variant="solo" rounded="lg" hide-details
          @keyup.enter="sendMessage" />
        <v-btn icon="mdi-send" size="large" color="primary" @click="sendMessage" />
      </v-sheet>
    </v-sheet>
  </div>

  <div v-else class="pa-5 text-center">
    Not Found User
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user.js'
import UserBar from './UserBar.vue'

const route = useRoute()
const store = useUserStore()
const chatContainer = ref(null)
const newMessage = ref('')

const user = computed(() => store.users.find(u => u.uid === route.params.uid))

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value)
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !user.value) return

  store.addMessage(user.value.uid, {
    text: newMessage.value,
    fromMe: true,
  })

  newMessage.value = ''
}

onMounted(async () => {
  await store.fetchUsers()
  if (user.value) {
    await store.fetchMessages(user.value.uid)
    scrollToBottom()
  }
})

watch(
  () => route.params.uid,
  async (newUid) => {
    if (!newUid) return
    await store.fetchUsers()
    await store.fetchMessages(newUid)
  }
)

</script>

<style scoped>
.forMe {
  border-radius: 10px 10px 0px 10px;
}
.forYou {
  border-radius: 10px 10px 10px 0px;
}

.mobile {
  max-width: 40%
}

@media screen and (max-width: 600px) {
  .mobile {
    max-width: 75%
  }
}
</style>