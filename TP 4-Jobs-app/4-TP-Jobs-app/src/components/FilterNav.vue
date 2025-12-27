<template>
  <nav class="filter-nav">
    <button 
      :class="['filter-btn', { active: filter === 'all' }]"
      @click="$emit('filter-change', 'all')"
    >
      Tous
    </button>
    <button 
      :class="['filter-btn', { active: filter === 'recent' }]"
      @click="$emit('filter-change', 'recent')"
    >
      Récents
    </button>
    <button 
      :class="['filter-btn', { active: filter === 'high-salary' }]"
      @click="$emit('filter-change', 'high-salary')"
    >
      Salaire élevé
    </button>
  </nav>
</template>

<script>
export default {
  name: 'FilterNav',
  props: {
    filter: {
      type: String,
      default: 'all'
    }
  },
  emits: ['filter-change']
}
</script>

<style scoped>
.filter-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.filter-btn {
  padding: 0.5rem 1.5rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  color: #666;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}
</style>

