<template>
  <div id="app">
    <!-- Navbar -->
    <AppNavbar v-if="!loading" />

    <!-- Loading global -->
    <LoadingSpinner v-if="loading" full-screen />

    <!-- Contenu principal -->
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AppNavbar from '@/components/AppNavbar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const loading = ref(true)

// Initialiser l'authentification au démarrage
onMounted(async () => {
  await authStore.initAuth()
  loading.value = false
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>