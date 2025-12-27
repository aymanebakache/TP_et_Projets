<template>
  <div class="single-post">
    <h2 class="post-title">{{ post.title }}</h2>
    <div class="post-tags">
      <span 
        v-for="tag in post.tags" 
        :key="tag" 
        class="tag"
      >
        {{ tag }}
      </span>
    </div>
    <p class="post-snippet">{{ snippet }}</p>
    <router-link :to="`/post/${post.id}`" class="read-more">
      Lire la suite →
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const snippet = computed(() => {
  if (!props.post.body) return ''
  return props.post.body.substring(0, 50) + '...'
})
</script>

<style scoped>
.single-post {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.single-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.post-title {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.post-snippet {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.read-more {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.read-more:hover {
  color: #2c3e50;
}
</style>
