<template>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Breadcrumb et En-tête -->
        <div class="mb-6">
          <button 
            @click="router.back()"
            class="flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Retour au dashboard
          </button>
  
          <div v-if="project" class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ project.name }}</h1>
              <p v-if="project.description" class="text-gray-600 mt-2">
                {{ project.description }}
              </p>
            </div>
            <button 
              @click="openTaskModal()"
              class="btn-primary flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle tâche
            </button>
          </div>
        </div>
  
        <!-- Loading -->
        <LoadingSpinner v-if="loading" />
  
        <!-- Kanban Board -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Colonne To Do -->
          <div 
            class="bg-white rounded-xl shadow p-4"
            @drop="onDrop($event, 'todo')"
            @dragover.prevent
            @dragenter.prevent
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-700 flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-gray-400"></div>
                To Do
                <span class="text-sm font-normal text-gray-500">
                  ({{ todoTasks.length }})
                </span>
              </h2>
            </div>
            <div class="space-y-3 min-h-[200px]">
              <TaskCard
                v-for="task in todoTasks"
                :key="task.id"
                :task="task"
                @edit="openTaskModal(task)"
                @delete="confirmDeleteTask(task.id)"
              />
              <div 
                v-if="!todoTasks.length" 
                class="text-center text-gray-400 py-8"
              >
                Aucune tâche
              </div>
            </div>
          </div>
  
          <!-- Colonne Doing -->
          <div 
            class="bg-white rounded-xl shadow p-4"
            @drop="onDrop($event, 'doing')"
            @dragover.prevent
            @dragenter.prevent
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-700 flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                Doing
                <span class="text-sm font-normal text-gray-500">
                  ({{ doingTasks.length }})
                </span>
              </h2>
            </div>
            <div class="space-y-3 min-h-[200px]">
              <TaskCard
                v-for="task in doingTasks"
                :key="task.id"
                :task="task"
                @edit="openTaskModal(task)"
                @delete="confirmDeleteTask(task.id)"
              />
              <div 
                v-if="!doingTasks.length" 
                class="text-center text-gray-400 py-8"
              >
                Aucune tâche
              </div>
            </div>
          </div>
  
          <!-- Colonne Done -->
          <div 
            class="bg-white rounded-xl shadow p-4"
            @drop="onDrop($event, 'done')"
            @dragover.prevent
            @dragenter.prevent
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-700 flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                Done
                <span class="text-sm font-normal text-gray-500">
                  ({{ doneTasks.length }})
                </span>
              </h2>
            </div>
            <div class="space-y-3 min-h-[200px]">
              <TaskCard
                v-for="task in doneTasks"
                :key="task.id"
                :task="task"
                @edit="openTaskModal(task)"
                @delete="confirmDeleteTask(task.id)"
              />
              <div 
                v-if="!doneTasks.length" 
                class="text-center text-gray-400 py-8"
              >
                Aucune tâche
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de tâche -->
      <transition name="modal">
        <div 
          v-if="showTaskModal"
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          @click.self="closeTaskModal"
        >
          <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b">
              <h3 class="text-xl font-bold text-gray-800">
                {{ editingTask ? 'Modifier la tâche' : 'Nouvelle tâche' }}
              </h3>
              <button 
                @click="closeTaskModal"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <!-- Body -->
            <form @submit.prevent="handleTaskSubmit" class="p-6 space-y-4">
              <!-- Titre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input 
                  v-model="taskForm.title"
                  type="text"
                  required
                  placeholder="Ex: Créer la maquette"
                  class="input-field"
                />
              </div>
  
              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  v-model="taskForm.description"
                  rows="4"
                  placeholder="Décrivez la tâche..."
                  class="input-field resize-none"
                ></textarea>
              </div>
  
              <!-- Date d'échéance -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date d'échéance
                </label>
                <input 
                  v-model="taskForm.dueDate"
                  type="date"
                  class="input-field"
                />
              </div>
  
              <!-- Statut (uniquement en mode édition) -->
              <div v-if="editingTask">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select v-model="taskForm.status" class="input-field">
                  <option value="todo">To Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
              </div>
  
              <!-- Actions -->
              <div class="flex gap-3 pt-4">
                <button 
                  type="button"
                  @click="closeTaskModal"
                  class="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  :disabled="taskLoading"
                  class="btn-primary flex-1"
                >
                  {{ taskLoading ? 'Enregistrement...' : editingTask ? 'Modifier' : 'Créer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
  
      <!-- Modal de confirmation de suppression -->
      <div 
        v-if="showDeleteTaskModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="closeDeleteTaskModal"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            Confirmer la suppression
          </h3>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
          </p>
          <div class="flex gap-3">
            <button 
              @click="closeDeleteTaskModal"
              class="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button 
              @click="handleDeleteTask"
              :disabled="deleteTaskLoading"
              class="btn-danger flex-1"
            >
              {{ deleteTaskLoading ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProjectStore } from '@/stores/projectStore'
  import TaskCard from '@/components/TaskCard.vue'
  import LoadingSpinner from '@/components/LoadingSpinner.vue'
  
  const route = useRoute()
  const router = useRouter()
  const projectStore = useProjectStore()
  
  // État
  const loading = ref(true)
  const showTaskModal = ref(false)
  const showDeleteTaskModal = ref(false)
  const editingTask = ref(null)
  const taskToDelete = ref(null)
  const taskLoading = ref(false)
  const deleteTaskLoading = ref(false)
  
  // Formulaire de tâche
  const taskForm = ref({
    title: '',
    description: '',
    dueDate: '',
    status: 'todo'
  })
  
  // Projet et tâches
  const project = computed(() => projectStore.currentProject)
  const tasks = computed(() => projectStore.tasks)
  
  // Tâches par statut
  const todoTasks = computed(() => tasks.value.filter(t => t.status === 'todo'))
  const doingTasks = computed(() => tasks.value.filter(t => t.status === 'doing'))
  const doneTasks = computed(() => tasks.value.filter(t => t.status === 'done'))
  
  // Charger le projet et les tâches
  onMounted(async () => {
    const projectId = route.params.id
    await projectStore.fetchProject(projectId)
    projectStore.fetchTasks(projectId)
    loading.value = false
  })
  
  onUnmounted(() => {
    projectStore.currentProject = null
    projectStore.tasks = []
  })
  
  // Ouvrir modal de tâche
  const openTaskModal = (task = null) => {
    if (task) {
      editingTask.value = task
      taskForm.value = {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate || '',
        status: task.status
      }
    } else {
      editingTask.value = null
      taskForm.value = {
        title: '',
        description: '',
        dueDate: '',
        status: 'todo'
      }
    }
    showTaskModal.value = true
  }
  
  // Fermer modal de tâche
  const closeTaskModal = () => {
    showTaskModal.value = false
    editingTask.value = null
  }
  
  // Soumettre le formulaire de tâche
  const handleTaskSubmit = async () => {
    taskLoading.value = true
    
    try {
      const projectId = route.params.id
      
      if (editingTask.value) {
        // Modification
        await projectStore.updateTask(projectId, editingTask.value.id, taskForm.value)
      } else {
        // Création
        await projectStore.createTask(projectId, taskForm.value)
      }
      
      closeTaskModal()
    } finally {
      taskLoading.value = false
    }
  }
  
  // Confirmer suppression de tâche
  const confirmDeleteTask = (taskId) => {
    taskToDelete.value = taskId
    showDeleteTaskModal.value = true
  }
  
  // Fermer modal de suppression
  const closeDeleteTaskModal = () => {
    showDeleteTaskModal.value = false
    taskToDelete.value = null
  }
  
  // Supprimer la tâche
  const handleDeleteTask = async () => {
    if (!taskToDelete.value) return
    
    deleteTaskLoading.value = true
    
    try {
      const projectId = route.params.id
      await projectStore.deleteTask(projectId, taskToDelete.value)
      closeDeleteTaskModal()
    } finally {
      deleteTaskLoading.value = false
    }
  }
  
  // Drag and Drop
  const onDrop = async (event, newStatus) => {
    const taskId = event.dataTransfer.getData('taskId')
    const currentStatus = event.dataTransfer.getData('currentStatus')
    
    if (currentStatus === newStatus) return
    
    const projectId = route.params.id
    await projectStore.updateTask(projectId, taskId, { status: newStatus })
  }
  </script>
  
  <style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  </style>