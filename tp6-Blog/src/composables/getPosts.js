import { ref, onMounted, watch } from 'vue'
import { getAllPosts, getPostsByTag } from '../data/db.js'

export function usePosts(tag = null) {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPosts = async () => {
    loading.value = true
    error.value = null
    try {
      const currentTag = typeof tag === 'object' && tag.value !== undefined ? tag.value : tag
      if (currentTag) {
        posts.value = getPostsByTag(currentTag)
      } else {
        posts.value = getAllPosts()
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPosts()
  })

  // Si tag est réactif, écouter ses changements
  if (tag && typeof tag === 'object') {
    watch(tag, () => {
      fetchPosts()
    }, { immediate: false })
  }

  return {
    posts,
    loading,
    error,
    fetchPosts
  }
}


