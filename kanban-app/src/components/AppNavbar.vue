<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">K</span>
            </div>
            <span class="text-xl font-bold text-gray-800">Kanban Pro</span>
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="authStore.user">
            <router-link 
              to="/dashboard" 
              class="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Dashboard
            </router-link>

            <div class="relative" ref="dropdownRef">
              <button 
                @click="toggleDropdown"
                class="flex items-center space-x-2 focus:outline-none"
              >
                <img 
                  v-if="authStore.user.photoURL" 
                  :src="authStore.user.photoURL" 
                  alt="Avatar"
                  class="w-9 h-9 rounded-full border-2 border-primary-600"
                />
                <div 
                  v-else 
                  class="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold"
                >
                  {{ userInitials }}
                </div>
              </button>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div 
                  v-if="showDropdown"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                >
                  <div class="px-4 py-3 border-b border-gray-200">
                    <p class="text-sm font-medium text-gray-900">
                      {{ authStore.user.displayName || 'Utilisateur' }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ authStore.user.email }}
                    </p>
                  </div>
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
              </transition>
            </div>
          </template>

          <template v-else>
            <router-link 
              to="/auth" 
              class="btn-primary"
            >
              Connexion
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const showDropdown = ref(false)
const dropdownRef = ref(null)

const userInitials = computed(() => {
  const name = authStore.user?.displayName || authStore.user?.email || 'U'
  return name.charAt(0).toUpperCase()
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleLogout = async () => {
  showDropdown.value = false
  await authStore.logout()
  router.push('/')
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
