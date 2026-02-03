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
        createdAt: new Date().toLocaleTimeString('ru-UZ', {
          timeZone: 'Asia/Tashkent',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
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

    async addFriend(userId, friendUid, friendEmail, friendName, friendMessages, friendAvatar, friendId) {
      if (!this.currentUser) return

      if (!this.currentUser.friends) {
        this.currentUser.friends = []
      }

      await fetch(`${API_USERS}/${userId}/friends/${friendUid}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: friendId,
          uid: friendUid,
          userName: friendName,
          email: friendEmail,
          avatar: friendAvatar,
          messages: friendMessages
        })
      }
      )

      this.fetchUsers()
    },

    async removeFriend(userId, friendUid) {
      await fetch(`${API_USERS}/${userId}/friends/${friendUid}.json`, {
        method: 'DELETE',
      })

      this.fetchUsers()
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
        userName: userName,
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
