import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/project/:id',
    name: 'project-details',
    component: () => import('@/views/ProjectDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  // Attendre que l'authentification soit initialisée
  if (authStore.loading) {
    authStore.initAuth().then(() => {
      checkNavigation()
    })
  } else {
    checkNavigation()
  }

  function checkNavigation() {
    if (requiresAuth && !authStore.user) {
      // Route protégée, utilisateur non connecté
      next({ name: 'auth' })
    } else if (requiresGuest && authStore.user) {
      // Route pour invités, utilisateur connecté
      next({ name: 'dashboard' })
    } else {
      next()
    }
  }
})

export default router