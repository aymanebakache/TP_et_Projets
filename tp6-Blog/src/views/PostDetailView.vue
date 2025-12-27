<template>
  <div class="post-detail">
    <div class="post-detail-container">
      <div class="main-content">
        <div v-if="loading" class="loading">Chargement...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="post" class="post-content">
          <div class="post-header">
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-actions">
              <button @click="handleDelete" class="btn btn-delete">Supprimer</button>
            </div>
          </div>
          
          <div class="post-tags">
            <span 
              v-for="tag in post.tags" 
              :key="tag" 
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
          
          <div class="post-body">
            <p v-for="(paragraph, index) in bodyParagraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>
          
          <router-link to="/" class="back-link">← Retour à la liste</router-link>
        </div>
        <div v-else class="not-found">
          Article non trouvé
        </div>
      </div>
      <TagCloud />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePost } from '../composables/getPost.js'
import TagCloud from '../components/TagCloud.vue'
import { deletePost } from '../data/db.js'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const { post, loading, error } = usePost(id)

const bodyParagraphs = computed(() => {
  if (!post.value || !post.value.body) return []
  return post.value.body.split('\n').filter(p => p.trim().length > 0)
})

const handleDelete = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    deletePost(id.value)
    router.push('/')
  }
}
</script>

<style scoped>
.post-detail {
  padding: 2rem 0;
}

.post-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 2rem;
}

.main-content {
  flex: 1;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #e74c3c;
}

.post-content {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.post-title {
  color: #2c3e50;
  margin: 0;
  font-size: 2rem;
  flex: 1;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag {
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.post-body {
  color: #333;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.post-body p {
  margin-bottom: 1rem;
}

.back-link {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.back-link:hover {
  color: #2c3e50;
}

@media (max-width: 768px) {
  .post-detail-container {
    flex-direction: column;
  }
  
  .post-header {
    flex-direction: column;
  }
}
</style>

