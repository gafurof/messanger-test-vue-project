<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="380" elevation="2" class="pa-6 rounded-xl">
      <v-card-text>
        <div class="text-h6 text-center mb-6">Signup to Messenger</div>

        <v-form ref="form" @submit.prevent="signup">
          <v-text-field
            v-model="userName"
            label="User Name"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="email"
            label="Email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            :rules="[rules.required, rules.email]"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            :prepend-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:prepend-inner="showPassword = !showPassword"
            variant="outlined"
            :rules="[rules.required, rules.min6]"
          />

          <v-btn
            block
            color="primary"
            size="large"
            class="mt-4"
            :loading="loading"
            :disabled="loading"
            type="submit"
          >
            <span v-if="!loading">Confirm</span>
          </v-btn>
        </v-form>

        <div class="text-center mt-3 cursor-pointer text-blue-600" @click="toLogin">
          I have account
        </div>
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
const loading = ref(false)
const form = ref(null)

const rules = {
  required: (v) => !!v || 'Field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
  min6: (v) => (v && v.length >= 6) || 'Password min 6 characters'
}

function toLogin() {
  router.push('/login')
}

const signup = async () => {
  if (!form.value.validate()) return
  loading.value = true
  try {
    await store.signup(email.value, password.value, userName.value)
    router.push('/')
  } catch (e) {
    alert(e.message)
  } finally {
    loading.value = false
  }
}
</script>
