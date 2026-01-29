import { defineStore } from 'pinia'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { app } from '@/firebase'

const auth = getAuth(app)
const API_URL = 'https://clone-telegram-46e49-default-rtdb.firebaseio.com/users.json'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: JSON.parse(localStorage.getItem('user'))
  }),

  getters: {
    isLoggedIn: state => !!state.currentUser
  },

  actions: {
    async fetchMessages(withUserUid) {
      if (!this.currentUser) return

      const chatId = [this.currentUser.uid, withUserUid].sort().join('_')
      const res = await fetch(
        `https://clone-telegram-46e49-default-rtdb.firebaseio.com/messages/${chatId}.json`
      )

      const data = await res.json()
      if (!data) return

      const messages = Object.values(data)

      const user = this.users.find(u => u.uid === withUserUid)
      if (!user) return

      user.messages = messages.map(m => ({
        ...m,
        fromMe: m.senderId === this.currentUser.uid
      }))
    },
    async addMessage(receiverUid, message) {
      if (!this.currentUser) return

      const chatId = [this.currentUser.uid, receiverUid].sort().join('_')

      const newMessage = {
        id: Date.now(),
        text: message?.text,
        senderId: this.currentUser.uid,
        createdAt: Date.now(),
        hour: new Date().getHours() + ':' + new Date().getMinutes()
      }

      this.users.forEach(u => {
        if (u.uid === receiverUid || u.uid === this.currentUser.uid) {
          if (!u.messages) u.messages = []
          u.messages.push({
            ...newMessage,
            fromMe: u.uid === this.currentUser.uid
          })
        }
      })

      await fetch(
        `https://clone-telegram-46e49-default-rtdb.firebaseio.com/messages/${chatId}.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage)
        }
      )
    },
    async fetchUsers() {
      const res = await fetch(API_URL)
      const data = await res.json()

      if (!data) {
        this.users = []
        return
      }

      this.users = Object.entries(data).map(([key, user]) => ({
        id: key,
        ...user,
        messages: Array.isArray(user.messages) ? user.messages : []
      }))
    },

    async login(email, password) {
      const res = await signInWithEmailAndPassword(auth, email, password)
      this.currentUser = {
        uid: res.user.uid,
        email: res.user.email,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
      await this.fetchUsers()
      localStorage.setItem('user', JSON.stringify(this.currentUser))
    },

    async signup(email, password, userName) {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      const newUser = {
        userName: userName,
        uid: res.user.uid,
        email: res.user.email,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
      this.currentUser = newUser
      localStorage.setItem('user', JSON.stringify(this.currentUser))
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      await this.fetchUsers()
    },

    editUserInfo(userId, userName, userAvatar) {
      fetch(`https://clone-telegram-46e49-default-rtdb.firebaseio.com/users/${userId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: userName,
          avatar  : userAvatar
        })
      })
        .then(res => res.json())
        .catch(err => console.error(err))
    },

    addFriend(userId, friendsList) {
      fetch(`https://clone-telegram-46e49-default-rtdb.firebaseio.com/users/${userId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          friends: friendsList,
        })
      })
        .then(res => res.json())
        .catch(err => console.error(err))
    },

    logout() {
      this.currentUser = null
      localStorage.clear()
    },
  }
})
