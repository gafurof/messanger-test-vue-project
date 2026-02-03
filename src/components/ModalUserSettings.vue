<template>
  <div class="text-center pa-4">
    <v-dialog width="500" v-model="dialog" transition="dialog-bottom-transition">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn prepend-icon="mdi-cog" text="Settings" v-bind="activatorProps"></v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-toolbar-items>
            <v-btn text="Save" variant="text" @click="saveUserInfo"></v-btn>
          </v-toolbar-items>

        </v-toolbar>
        <v-list lines="two">
          <v-list-subheader class="w-100 d-flex align-center justify-center text-center">
            <v-img :width="80" rounded="circle" aspect-ratio="1/1" :src="modalUserAvatar" class="mr-2"></v-img>
            <h3 class="mt-1 mr-2">{{ modalUserName }}</h3>
          </v-list-subheader>
          <v-list-item title="Change name">
            <v-text-field hide-details="auto" label="UserName" v-model="newName"></v-text-field>
          </v-list-item>
          <v-list-item title="Change avatar">
            <v-select :items="['men', 'women']" v-model="menOrWomen" label="avatar men women?"></v-select>
            <v-text-field hide-details="auto" label="number 1>99" v-model="newAvatar" type="number"></v-text-field>
          </v-list-item>
          <div class="d-flex justify-space-between align-center pa-2">
            <v-btn @click="modeTheme" class="ma-2" color="primary"
              :icon="darkLightMode ? 'mdi-weather-sunny' : 'mdi-weather-night'"></v-btn>
            <v-btn class="ma-2" color="primary" prepend-icon="mdi-logout" text @click="logout">
              Logout
            </v-btn>
          </div>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '@/store/user.js'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

const theme = useTheme()
const store = useUserStore()
const router = useRouter()
const dialog = ref(false)

const userUid = store.currentUser.uid

const user = computed(() => store.users.find(u => u.uid === userUid) || null)

const darkLightMode = ref(false)

function modeTheme() {
  darkLightMode.value = !darkLightMode.value
  if (darkLightMode.value) {
    localStorage.setItem('theme', 'dark')
    theme.global.name.value = 'dark'
  } else if (darkLightMode.value === false) {
    localStorage.setItem('theme', 'light')
    theme.global.name.value = 'light'
  }
}


const newName = ref('')
const newAvatar = ref('')
const modalUserName = ref('')
const modalUserAvatar = ref('')
const menOrWomen = ref('men')

watch(user, (u) => {
  if (u) {
    newName.value = u.userName
    newAvatar.value = u.avatar
    modalUserName.value = u.userName
    modalUserAvatar.value = u.avatar
  }
}, { immediate: true })

function saveUserInfo() {
  if (!user.value && (newAvatar.value < 0 || newAvatar.value > 99) && newName.value.length < 1) return
  dialog.value = false
  const avatarLink = `https://randomuser.me/api/portraits/${menOrWomen.value}/${newAvatar.value}.jpg`
  store.editUserInfo(user.value.id, newName.value, avatarLink)
  modalUserName.value = newName.value
  modalUserAvatar.value = `https://randomuser.me/api/portraits/${menOrWomen.value}/${newAvatar.value}.jpg`
}

onMounted(() => {
  if (localStorage.getItem("theme") === "dark") {
    theme.global.name.value = "dark";
  } else if (localStorage.getItem("theme") === "light") {
    theme.global.name.value = "light";
  }
});

function logout() {
  store.logout()
  router.push('/login')
}
</script>
