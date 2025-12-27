<template>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- En-tête -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mes Projets</h1>
            <p class="text-gray-600 mt-1">
              Gérez et organisez tous vos projets
            </p>
          </div>
          <button 
            @click="openCreateModal"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nouveau projet
          </button>
        </div>
  
        <!-- Loading -->
        <LoadingSpinner v-if="projectStore.loading && !projects.length" />
  
        <!-- Liste vide -->
        <div 
          v-else-if="!projects.length" 
          class="text-center py-20"
        >
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Aucun projet
          </h3>
          <p class="text-gray-600 mb-6">
            Commencez par créer votre premier projet
          </p>
          <button 
            @click="openCreateModal"
            class="btn-primary"
          >
            Créer un projet
          </button>
        </div>
  
        <!-- Grille de projets -->
        <div 
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="project in projects"
            :key="project.id"
            class="bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer border-t-4 group"
            :class="getColorClass(project.color)"
            @click="goToProject(project.id)"
          >
            <div class="p-6">
              <!-- En-tête du projet -->
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {{ project.name }}
                  </h3>
                  <p 
                    v-if="project.description" 
                    class="text-gray-600 mt-2 text-sm line-clamp-2"
                  >
                    {{ project.description }}
                  </p>
                </div>
  
                <!-- Menu actions -->
                <div class="relative ml-2" ref="dropdownRefs[project.id]">
                  <button 
                    @click.stop="toggleDropdown(project.id)"
                    class="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
  
                  <!-- Dropdown -->
                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <div 
                      v-if="activeDropdown === project.id"
                      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10"
                    >
                      <button
                        @click.stop="openEditModal(project)"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                      <button
                        @click.stop="confirmDelete(project)"
                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </transition>
                </div>
              </div>
  
              <!-- Stats du projet -->
              <div class="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatDate(project.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de projet -->
      <ProjectModal
        :show="showModal"
        :project="selectedProject"
        :loading="modalLoading"
        @close="closeModal"
        @submit="handleProjectSubmit"
      />
  
      <!-- Modal de confirmation de suppression -->
      <div 
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="closeDeleteModal"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            Confirmer la suppression
          </h3>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer le projet "{{ projectToDelete?.name }}" ? 
            Cette action est irréversible et supprimera également toutes les tâches associées.
          </p>
          <div class="flex gap-3">
            <button 
              @click="closeDeleteModal"
              class="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button 
              @click="handleDelete"
              :disabled="deleteLoading"
              class="btn-danger flex-1"
            >
              {{ deleteLoading ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { useProjectStore } from '@/stores/projectStore'
  import ProjectModal from '@/components/ProjectModal.vue'
  import LoadingSpinner from '@/components/LoadingSpinner.vue'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const projectStore = useProjectStore()
  
  // État des modals
  const showModal = ref(false)
  const showDeleteModal = ref(false)
  const selectedProject = ref(null)
  const projectToDelete = ref(null)
  const modalLoading = ref(false)
  const deleteLoading = ref(false)
  
  // Dropdown menu
  const activeDropdown = ref(null)
  const dropdownRefs = ref({})
  
  // Projets
  const projects = computed(() => projectStore.projects)
  
  // Charger les projets au montage
  onMounted(() => {
    if (authStore.user) {
      console.log('🔍 User ID:', authStore.user.uid)
      console.log('🔍 User complet:', authStore.user)
      projectStore.fetchProjects(authStore.user.uid)
    } else {
      console.error('❌ Aucun utilisateur connecté')
    }
    document.addEventListener('click', handleClickOutside)
  })
  
  // Debug : Observer les changements de projets
  watch(() => projectStore.projects, (newProjects) => {
    console.log('📦 Projets reçus:', newProjects)
    console.log('📦 Nombre de projets:', newProjects.length)
  }, { immediate: true })
  
  onUnmounted(() => {
    projectStore.cleanup()
    document.removeEventListener('click', handleClickOutside)
  })
  
  // Fermer les dropdowns en cliquant à l'extérieur
  const handleClickOutside = (event) => {
    const isOutside = Object.values(dropdownRefs.value).every(ref => 
      !ref || !ref.contains(event.target)
    )
    if (isOutside) {
      activeDropdown.value = null
    }
  }
  
  // Toggle dropdown
  const toggleDropdown = (projectId) => {
    activeDropdown.value = activeDropdown.value === projectId ? null : projectId
  }
  
  // Ouvrir modal de création
  const openCreateModal = () => {
    selectedProject.value = null
    showModal.value = true
    activeDropdown.value = null
  }
  
  // Ouvrir modal d'édition
  const openEditModal = (project) => {
    selectedProject.value = project
    showModal.value = true
    activeDropdown.value = null
  }
  
  // Fermer modal
  const closeModal = () => {
    showModal.value = false
    selectedProject.value = null
  }
  
  // Soumettre le formulaire de projet
  const handleProjectSubmit = async (projectData) => {
    modalLoading.value = true
    
    try {
      if (selectedProject.value) {
        // Modification
        await projectStore.updateProject(selectedProject.value.id, projectData)
      } else {
        // Création
        await projectStore.createProject(authStore.user.uid, projectData)
      }
      closeModal()
    } finally {
      modalLoading.value = false
    }
  }
  
  // Confirmer suppression
  const confirmDelete = (project) => {
    projectToDelete.value = project
    showDeleteModal.value = true
    activeDropdown.value = null
  }
  
  // Fermer modal de suppression
  const closeDeleteModal = () => {
    showDeleteModal.value = false
    projectToDelete.value = null
  }
  
  // Supprimer le projet
  const handleDelete = async () => {
    if (!projectToDelete.value) return
    
    deleteLoading.value = true
    
    try {
      await projectStore.deleteProject(projectToDelete.value.id)
      closeDeleteModal()
    } finally {
      deleteLoading.value = false
    }
  }
  
  // Naviguer vers les détails du projet
  const goToProject = (projectId) => {
    router.push({ name: 'project-details', params: { id: projectId } })
  }
  
  // Obtenir la classe de couleur pour la bordure
  const getColorClass = (color) => {
    const colors = {
      blue: 'border-blue-500',
      green: 'border-green-500',
      red: 'border-red-500',
      yellow: 'border-yellow-500',
      purple: 'border-purple-500',
      pink: 'border-pink-500',
      indigo: 'border-indigo-500',
      orange: 'border-orange-500'
    }
    return colors[color] || 'border-blue-500'
  }
  
  // Formater la date
  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>