import { createRouter, createWebHistory } from 'vue-router'
import PageLogin from '@/pages/PageLogin.vue'
import PageSignup from '@/pages/PageSignup.vue'
import TheNav from '@/UI/TheNav.vue'
import UserChat from '@/components/UserChat.vue'
import { useUserStore } from '@/store/user.js'

const routes = [
  { path: '/login', component: PageLogin },
  { path: '/signup', component: PageSignup },
  { path: '/', component: TheNav, meta: { requiresAuth: true } },
  { path: '/chat/:uid', component: UserChat, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useUserStore()
  if (to.meta.requiresAuth && !store.isLoggedIn) return next('/login')
  if ((to.path === '/login' || to.path === '/signup') && store.isLoggedIn) {
    return next('/')
  }
  next()
})

export default router
