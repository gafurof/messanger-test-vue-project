import { defineStore } from 'pinia'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { app } from '@/firebase'

const auth = getAuth(app)
const API_USERS = 'https://clone-telegram-46e49-default-rtdb.firebaseio.com/users'
const API_MESSAGES = 'https://clone-telegram-46e49-default-rtdb.firebaseio.com/messages'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: JSON.parse(localStorage.getItem('user')),
    activeChatUid: null
  }),

  getters: {
    isLoggedIn: state => !!state.currentUser,

    activeChat() {
      return this.users.find(u => u.uid === this.activeChatUid)
    }
  },

  actions: {
    async fetchUsers() {
      const res = await fetch(`${API_USERS}.json`)
      const data = await res.json()

      if (!data) {
        this.users = []
        return
      }

      this.users = Object.entries(data)
        .map(([id, user]) => ({
          id,
          ...user,
          messages: []
        }))
        .filter(u => u.uid !== this.currentUser?.uid)
    },

    setActiveChat(uid) {
      this.activeChatUid = uid
      this.fetchMessages(uid)
    },

    async fetchMessages(withUserUid) {
      if (!this.currentUser) return

      const chatId = [this.currentUser.uid, withUserUid].sort().join('_')

      const res = await fetch(`${API_MESSAGES}/${chatId}.json`)
      const data = await res.json()

      if (!data) return

      const messages = Object.values(data).map(m => ({
        ...m,
        fromMe: m.senderId === this.currentUser.uid
      }))

      const user = this.users.find(u => u.uid === withUserUid)
      if (user) {
        user.messages = messages
      }
    },

    async addMessage(receiverUid, message) {
      if (!this.currentUser) return

      const chatId = [this.currentUser.uid, receiverUid].sort().join('_')

      const newMessage = {
        text: message.text,
        senderId: this.currentUser.uid,
        createdAt: Date.now()
      }

      const user = this.users.find(u => u.uid === receiverUid)
      if (user) {
        user.messages.push({
          ...newMessage,
          fromMe: true
        })
      }

      await fetch(`${API_MESSAGES}/${chatId}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      })
    },

    async addFriend(friend) {
      if (!this.currentUser) return

      const res = await fetch(
        `${API_USERS}/${this.currentUser.id}/friends.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(friend)
        }
      )

      if (!this.currentUser.friends) {
        this.currentUser.friends = []
      }

      this.currentUser.friends.push(friend)
      localStorage.setItem('user', JSON.stringify(this.currentUser))
    },

    async login(email, password) {
      const res = await signInWithEmailAndPassword(auth, email, password)

      this.currentUser = {
        uid: res.user.uid,
        email: res.user.email,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        friends: []
      }

      localStorage.setItem('user', JSON.stringify(this.currentUser))
      await this.fetchUsers()
    },

    async signup(email, password, userName) {
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const newUser = {
        uid: res.user.uid,
        email: res.user.email,
        userName,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        friends: []
      }

      this.currentUser = newUser
      localStorage.setItem('user', JSON.stringify(newUser))

      await fetch(`${API_USERS}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      await this.fetchUsers()
    },

    logout() {
      signOut(auth)
      this.currentUser = null
      this.users = []
      this.activeChatUid = null
      localStorage.clear()
    }
  }
})
