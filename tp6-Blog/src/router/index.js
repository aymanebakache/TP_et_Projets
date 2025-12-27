import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CreatePostView from '../views/CreatePostView.vue'
import PostDetailView from '../views/PostDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/addPost',
    name: 'AddPost',
    component: CreatePostView
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetailView,
    props: true
  },
  {
    path: '/tags/:tag',
    name: 'TagPosts',
    component: Home,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router


