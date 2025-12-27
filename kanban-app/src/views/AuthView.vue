<template>
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full">
        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- Logo -->
          <div class="flex justify-center mb-8">
            <div class="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-2xl">K</span>
            </div>
          </div>
  
          <!-- Titre -->
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-2">
            {{ isLogin ? 'Connexion' : 'Inscription' }}
          </h2>
          <p class="text-center text-gray-600 mb-8">
            {{ isLogin ? 'Content de vous revoir !' : 'Créez votre compte gratuitement' }}
          </p>
  
          <!-- Bouton Google -->
          <button 
            @click="handleGoogleAuth"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>
  
          <!-- Séparateur -->
          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">Ou avec votre email</span>
            </div>
          </div>
  
          <!-- Formulaire -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input 
                v-model="form.email"
                type="email"
                required
                placeholder="votre@email.com"
                class="input-field"
                :disabled="loading"
              />
            </div>
  
            <!-- Mot de passe -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input 
                v-model="form.password"
                type="password"
                required
                placeholder="••••••••"
                minlength="6"
                class="input-field"
                :disabled="loading"
              />
              <p class="text-xs text-gray-500 mt-1">
                Minimum 6 caractères
              </p>
            </div>
  
            <!-- Message d'erreur -->
            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>
  
            <!-- Bouton submit -->
            <button 
              type="submit"
              :disabled="loading"
              class="w-full btn-primary py-3"
            >
              {{ loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire' }}
            </button>
          </form>
  
          <!-- Toggle entre connexion/inscription -->
          <div class="mt-6 text-center">
            <button 
              @click="toggleMode"
              class="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {{ isLogin ? 'Pas encore de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  // État du formulaire
  const isLogin = ref(true)
  const loading = ref(false)
  const error = ref(null)
  
  const form = ref({
    email: '',
    password: ''
  })
  
  // Toggle entre connexion et inscription
  const toggleMode = () => {
    isLogin.value = !isLogin.value
    error.value = null
    form.value = { email: '', password: '' }
  }
  
  // Soumission du formulaire
  const handleSubmit = async () => {
    error.value = null
    loading.value = true
  
    try {
      let result
      if (isLogin.value) {
        result = await authStore.login(form.value.email, form.value.password)
      } else {
        result = await authStore.register(form.value.email, form.value.password)
      }
  
      if (result.success) {
        router.push('/dashboard')
      } else {
        error.value = result.error
      }
    } finally {
      loading.value = false
    }
  }
  
  // Authentification avec Google
  const handleGoogleAuth = async () => {
    error.value = null
    loading.value = true
  
    try {
      const result = await authStore.loginWithGoogle()
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        error.value = result.error
      }
    } finally {
      loading.value = false
    }
  }
  </script>