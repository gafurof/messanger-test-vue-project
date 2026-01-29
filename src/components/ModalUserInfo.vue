<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Edit Profile" variant="tonal"
          v-bind="activatorProps"></v-btn>
      </template>

      <v-card prepend-icon="mdi-account" title="User Profile">
        <v-card-text>
          <v-row dense>
            <!-- <v-col cols="12" md="4" sm="6">
              <v-text-field label="First name*" required></v-text-field>
            </v-col> -->

            <v-col cols="12" sm="6">
              <v-select v-model="radioValue" :items="['friend', 'nonfriend']" label="Select Option"></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

          <v-btn color="primary" text="Save" variant="tonal" @click="addFriend"></v-btn>
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
let radioValue = ref('nonfriend')

function addFriend() {
  const user = store.users.find(u => u.uid === store.currentUser.uid)
  const friend = store.users.find(u => u.uid === route.params.uid)
  user.friends.push(friend)
  store.addFriend(user.id, user.friends)
  dialog.value = false
}
</script>
