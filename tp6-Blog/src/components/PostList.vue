<template>
  <div class="post-list">
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="posts.length === 0" class="no-posts">
      Aucun article trouvé.
    </div>
    <SinglePost 
      v-else
      v-for="post in posts" 
      :key="post.id" 
      :post="post"
    />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { usePosts } from '../composables/getPosts.js'
import SinglePost from './SinglePost.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tag = computed(() => route.params.tag || null)
const { posts, loading, error, fetchPosts } = usePosts(tag)

// Réagir aux changements de route (y compris quand on revient à la page d'accueil)
watch(() => route.fullPath, () => {
  fetchPosts()
})
</script>

<style scoped>
.post-list {
  flex: 1;
}

.loading, .error, .no-posts {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #e74c3c;
}
</style>

