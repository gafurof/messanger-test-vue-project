<template>
  <div class="w-100" v-if="user">
    <user-bar :avatar="user.avatar" :userName="user.userName"></user-bar>
    <v-sheet height="90vh" class="d-flex flex-column" style="border-left: 1px solid #DCDCDC;">
      <v-sheet ref="chatContainer" class="flex-grow-1 overflow-y-auto pa-4">
        <div v-for="msg in user.messages || []" :key="msg.id" class="d-flex mb-2"
          :class="msg.fromMe ? 'justify-end' : 'justify-start'">
          <v-expand-x-transition>
            <v-sheet class="pa-3 mobile" :class="msg.fromMe ? 'forMe' : 'forYou'"
              :color="msg.fromMe ? 'primary' : 'grey-lighten-3'" :text-color="msg.fromMe ? 'white' : 'black'">
              <div>{{ msg.text }}</div>
              <div class="text-caption" :class="msg.fromMe ? 'text-right' : 'text-left'">
                {{ msg.createdAt }}
              </div>
            </v-sheet>
          </v-expand-x-transition>
        </div>
      </v-sheet>

      <v-sheet class="pa-3 d-flex align-center gap-3" elevation="0" style="background-color: transparent;">
        <v-text-field v-model="newMessage" placeholder="Xabar yozing..." variant="solo" rounded="lg" hide-details
          class="flex-grow-1" style="background-color: rgba(255,255,255,0.1);" @keyup.enter="sendMessage" />
        <v-fade-transition>
          <v-btn v-if="newMessage.length > 0" icon="mdi-send" color="primary" @click="sendMessage" />
        </v-fade-transition>
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
  max-width: 40%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

@media screen and (max-width: 600px) {
  .mobile {
    max-width: 75%;
  }
}
</style>
