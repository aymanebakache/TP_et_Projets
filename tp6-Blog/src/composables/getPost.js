import { ref, onMounted } from 'vue'
import { getPostById } from '../data/db.js'

export function usePost(id) {
  const post = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchPost = async () => {
    loading.value = true
    error.value = null
    try {
      post.value = getPostById(id.value)
      if (!post.value) {
        error.value = 'Post non trouvé'
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPost()
  })

  return {
    post,
    loading,
    error,
    fetchPost
  }
}
