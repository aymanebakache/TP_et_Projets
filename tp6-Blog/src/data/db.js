// Base de données locale utilisant localStorage
const STORAGE_KEY = 'blog-posts'

// Initialiser avec des données d'exemple si la base est vide
const initialPosts = [
  {
    id: 1,
    title: 'Bienvenue sur le blog',
    body: 'Ceci est le premier article de notre blog. Vous pouvez ajouter, modifier et supprimer des articles.',
    tags: ['bienvenue', 'introduction'],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Introduction à Vue.js',
    body: 'Vue.js est un framework JavaScript progressif pour construire des interfaces utilisateur. Il est conçu pour être adopté de manière incrémentale.',
    tags: ['vuejs', 'javascript', 'framework'],
    createdAt: new Date().toISOString()
  }
]

// Fonction pour obtenir tous les posts
export function getAllPosts() {
  const posts = localStorage.getItem(STORAGE_KEY)
  if (!posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPosts))
    return initialPosts
  }
  return JSON.parse(posts)
}

// Fonction pour obtenir un post par ID
export function getPostById(id) {
  const posts = getAllPosts()
  return posts.find(post => post.id === parseInt(id))
}

// Fonction pour sauvegarder un nouveau post
export function savePost(post) {
  const posts = getAllPosts()
  const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1
  const newPost = {
    ...post,
    id: newId,
    createdAt: new Date().toISOString()
  }
  posts.push(newPost)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  return newPost
}

// Fonction pour mettre à jour un post
export function updatePost(id, updatedPost) {
  const posts = getAllPosts()
  const index = posts.findIndex(post => post.id === parseInt(id))
  if (index !== -1) {
    posts[index] = { ...updatedPost, id: parseInt(id) }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    return posts[index]
  }
  return null
}

// Fonction pour supprimer un post
export function deletePost(id) {
  const posts = getAllPosts()
  const filteredPosts = posts.filter(post => post.id !== parseInt(id))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPosts))
  return filteredPosts
}

// Fonction pour obtenir tous les tags uniques
export function getAllTags() {
  const posts = getAllPosts()
  const tagsSet = new Set()
  posts.forEach(post => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach(tag => tagsSet.add(tag))
    }
  })
  return Array.from(tagsSet)
}

// Fonction pour obtenir les posts par tag
export function getPostsByTag(tag) {
  const posts = getAllPosts()
  return posts.filter(post => 
    Array.isArray(post.tags) && post.tags.includes(tag)
  )
}


