<template>
  <div class="create-post">
    <div class="create-post-container">
      <h1 class="page-title">Créer un nouvel article</h1>
      <form @submit.prevent="handleSubmit" class="post-form">
        <div class="form-group">
          <label for="title">Titre</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="form-input"
            placeholder="Entrez le titre de l'article"
          />
        </div>
        
        <div class="form-group">
          <label for="body">Contenu</label>
          <textarea
            id="body"
            v-model="form.body"
            required
            class="form-textarea"
            rows="10"
            placeholder="Entrez le contenu de l'article"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="tags">Tags (séparés par des virgules)</label>
          <input
            id="tags"
            v-model="tagsInput"
            type="text"
            class="form-input"
            placeholder="ex: vuejs, javascript, tutorial"
          />
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Créer l'article</button>
          <router-link to="/" class="btn btn-secondary">Annuler</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { savePost } from '../data/db.js'

const router = useRouter()

const form = ref({
  title: '',
  body: '',
  tags: []
})

const tagsInput = ref('')

const handleSubmit = () => {
  // Convertir la chaîne de tags en tableau
  form.value.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
  
  // Sauvegarder le post
  savePost(form.value)
  
  // Rediriger vers la page d'accueil
  router.push('/')
}
</script>

<style scoped>
.create-post {
  padding: 2rem 0;
}

.create-post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.post-form {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #42b983;
}

.form-textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover {
  background-color: #35a372;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}
</style>

