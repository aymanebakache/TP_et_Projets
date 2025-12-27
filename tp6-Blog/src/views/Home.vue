<template>
  <div class="home">
    <div class="home-container">
      <div class="main-content">
        <h1 v-if="tag" class="page-title">Articles avec le tag: {{ tag }}</h1>
        <h1 v-else class="page-title">Tous les articles</h1>
        <PostList />
      </div>
      <TagCloud />
    </div>
  </div>
</template>

<script setup>
import PostList from '../components/PostList.vue'
import TagCloud from '../components/TagCloud.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tag = computed(() => route.params.tag)
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 2rem;
}

.main-content {
  flex: 1;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
}

@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
  }
}
</style>

