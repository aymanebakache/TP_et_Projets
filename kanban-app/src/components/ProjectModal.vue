<template>
  <transition name="modal-backdrop">
    <div 
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <transition name="modal-content">
        <div 
          v-if="show"
          class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center p-6 border-b">
            <h3 class="text-xl font-bold text-gray-800">
              {{ isEdit ? 'Modifier le projet' : 'Nouveau projet' }}
            </h3>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom du projet *
              </label>
              <input 
                v-model="form.name"
                type="text"
                required
                placeholder="Ex: Refonte du site web"
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea 
                v-model="form.description"
                rows="4"
                placeholder="Décrivez votre projet..."
                class="input-field resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <div class="flex gap-3 flex-wrap">
                <button
                  v-for="color in colors"
                  :key="color.value"
                  type="button"
                  @click="form.color = color.value"
                  :class="[
                    'w-10 h-10 rounded-lg transition-all',
                    color.class,
                    form.color === color.value 
                      ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' 
                      : 'hover:scale-105'
                  ]"
                  :title="color.name"
                ></button>
              </div>
            </div>

            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                type="button"
                @click="closeModal"
                class="btn-secondary flex-1"
              >
                Annuler
              </button>
              <button 
                type="submit"
                :disabled="loading"
                class="btn-primary flex-1"
              >
                {{ loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  project: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const colors = [
  { name: 'Bleu', value: 'blue', class: 'bg-blue-500' },
  { name: 'Vert', value: 'green', class: 'bg-green-500' },
  { name: 'Rouge', value: 'red', class: 'bg-red-500' },
  { name: 'Jaune', value: 'yellow', class: 'bg-yellow-500' },
  { name: 'Violet', value: 'purple', class: 'bg-purple-500' },
  { name: 'Rose', value: 'pink', class: 'bg-pink-500' },
  { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' }
]

const form = ref({
  name: '',
  description: '',
  color: 'blue'
})

const error = ref(null)
const isEdit = ref(false)

watch(() => props.project, (newProject) => {
  if (newProject) {
    isEdit.value = true
    form.value = {
      name: newProject.name || '',
      description: newProject.description || '',
      color: newProject.color || 'blue'
    }
  } else {
    isEdit.value = false
    form.value = {
      name: '',
      description: '',
      color: 'blue'
    }
  }
  error.value = null
}, { immediate: true })

const closeModal = () => {
  error.value = null
  emit('close')
}

const handleSubmit = () => {
  if (!form.value.name.trim()) {
    error.value = 'Le nom du projet est requis'
    return
  }

  emit('submit', {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
    color: form.value.color
  })
}
</script>

<style scoped>
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
