<template>
  <div class="tag-cloud">
    <h3 class="tag-cloud-title">Tags</h3>
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="tags.length === 0" class="no-tags">Aucun tag disponible</div>
    <div v-else class="tags-container">
      <router-link
        v-for="tag in tags"
        :key="tag"
        :to="`/tags/${tag}`"
        class="tag-link"
      >
        {{ tag }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllTags } from '../data/db.js'

const tags = ref([])
const loading = ref(false)

const fetchTags = () => {
  loading.value = true
  try {
    tags.value = getAllTags()
  } catch (err) {
    console.error('Erreur lors du chargement des tags:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTags()
})
</script>

<style scoped>
.tag-cloud {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-left: 2rem;
  min-width: 200px;
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.tag-cloud-title {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tag-link {
  color: #42b983;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
  font-weight: 500;
}

.tag-link:hover,
.tag-link.router-link-active {
  background-color: #42b983;
  color: white;
}

.loading, .no-tags {
  color: #666;
  font-size: 0.875rem;
}
</style>

