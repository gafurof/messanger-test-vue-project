<template>
  <v-container class="fill-height d-flex align-center justify-center h-100 w-100">
    <v-card width="380" elevation="0">
      <v-card-text>
        <div class="text-h6 text-center mb-6">Login to Messenger</div>

        <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email" variant="outlined" />
        <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Password"
          :prepend-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:prepend-inner="showPassword = !showPassword" variant="outlined" />

        <v-btn block color="primary" size="large" class="mt-4" @click="login">Confirm</v-btn>

        <div class="text-center mt-3 cursor-pointer" @click="toSignup">Create account</div>
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

function toSignup() {
  router.push('/signup')
}

const login = async () => {
  try {
    await store.login(email.value, password.value)
    router.push('/')
    const user = {
      email: email.value,
      password: password.value
    }
  } catch (e) {
    alert(e.message)
  }
}
</script>
