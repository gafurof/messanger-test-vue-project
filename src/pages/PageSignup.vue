<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="380" elevation="0">
      <v-card-text>
        <div class="text-h6 text-center mb-6">Signup to Messenger</div>

        <v-text-field v-model="userName" label="User Name" prepend-inner-icon="mdi-account" variant="outlined" />
        <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email" variant="outlined" />
        <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Password"
          :prepend-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:prepend-inner="showPassword = !showPassword" variant="outlined" />

        <v-btn block color="primary" size="large" class="mt-4" @click="signup">Confirm</v-btn>

        <div class="text-center mt-3 cursor-pointer" @click="toLogin">I have account</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.js'

const router = useRouter()
const store = useUserStore()

const email = ref('')
const password = ref('')
const userName = ref('')
const showPassword = ref(false)

function toLogin() {
  router.push('/login')
}

const signup = async () => {
  if (!email.value || !password.value) {
    alert('Email and passwordni notFound!')
    return
  }

  if (password.value.length < 6) {
    alert('Password min 6 length!')
    return
  }

  try {
    await store.signup(email.value, password.value, userName.value)
    router.push('/')
  } catch (e) {
    alert(e.message)
  }
}
</script>
