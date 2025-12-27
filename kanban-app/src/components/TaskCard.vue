<template>
    <div 
      class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-move border-l-4"
      :class="borderColorClass"
      draggable="true"
      @dragstart="onDragStart"
    >
      <!-- En-tête -->
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-semibold text-gray-800 flex-1">
          {{ task.title }}
        </h4>
        <div class="flex gap-1 ml-2">
          <button 
            @click="$emit('edit', task)"
            class="text-gray-400 hover:text-primary-600 transition-colors p-1"
            title="Modifier"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            @click="$emit('delete', task.id)"
            class="text-gray-400 hover:text-red-600 transition-colors p-1"
            title="Supprimer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
  
      <!-- Description -->
      <p 
        v-if="task.description" 
        class="text-sm text-gray-600 mb-3 line-clamp-3"
      >
        {{ task.description }}
      </p>
  
      <!-- Date d'échéance -->
      <div 
        v-if="task.dueDate" 
        class="flex items-center text-xs"
        :class="dueDateClass"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formattedDueDate }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    task: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['edit', 'delete', 'dragstart'])
  
  // Classe de bordure selon le statut
  const borderColorClass = computed(() => {
    const colors = {
      todo: 'border-gray-300',
      doing: 'border-blue-500',
      done: 'border-green-500'
    }
    return colors[props.task.status] || 'border-gray-300'
  })
  
  // Formater la date d'échéance
  const formattedDueDate = computed(() => {
    if (!props.task.dueDate) return ''
    const date = new Date(props.task.dueDate)
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  })
  
  // Classe de couleur pour la date selon si elle est dépassée
  const dueDateClass = computed(() => {
    if (!props.task.dueDate) return 'text-gray-500'
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(props.task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    
    if (props.task.status === 'done') {
      return 'text-green-600'
    } else if (dueDate < today) {
      return 'text-red-600 font-semibold'
    } else if (dueDate.getTime() === today.getTime()) {
      return 'text-orange-600 font-semibold'
    }
    
    return 'text-gray-500'
  })
  
  // Drag and drop
  const onDragStart = (event) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('taskId', props.task.id)
    event.dataTransfer.setData('currentStatus', props.task.status)
  }
  </script>
  
  <style scoped>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>