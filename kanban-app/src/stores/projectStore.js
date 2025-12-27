import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useProjectStore = defineStore('project', () => {
  // État
  const projects = ref([])
  const currentProject = ref(null)
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Listeners Firestore
  let projectsUnsubscribe = null
  let tasksUnsubscribe = null

  // Récupérer les projets de l'utilisateur en temps réel
  const fetchProjects = (userId) => {
    if (projectsUnsubscribe) projectsUnsubscribe()
    
    loading.value = true
    error.value = null

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    projectsUnsubscribe = onSnapshot(
      q,
      (snapshot) => {
        projects.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        loading.value = false
      },
      (err) => {
        error.value = 'Erreur lors du chargement des projets'
        console.error(err)
        loading.value = false
      }
    )
  }

  // Créer un projet
  const createProject = async (userId, projectData) => {
    try {
      loading.value = true
      error.value = null

      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return { success: true, id: docRef.id }
    } catch (err) {
      error.value = 'Erreur lors de la création du projet'
      console.error(err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour un projet
  const updateProject = async (projectId, projectData) => {
    try {
      loading.value = true
      error.value = null

      const projectRef = doc(db, 'projects', projectId)
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp()
      })

      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour du projet'
      console.error(err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Supprimer un projet
  const deleteProject = async (projectId) => {
    try {
      loading.value = true
      error.value = null

      // Supprimer toutes les tâches du projet
      if (tasks.value.length > 0) {
        const deletePromises = tasks.value.map(task => 
          deleteDoc(doc(db, 'projects', projectId, 'tasks', task.id))
        )
        await Promise.all(deletePromises)
      }

      // Supprimer le projet
      await deleteDoc(doc(db, 'projects', projectId))

      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de la suppression du projet'
      console.error(err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Récupérer un projet spécifique
  const fetchProject = async (projectId) => {
    try {
      loading.value = true
      error.value = null

      const projectRef = doc(db, 'projects', projectId)
      const projectSnap = await getDoc(projectRef)

      if (projectSnap.exists()) {
        currentProject.value = {
          id: projectSnap.id,
          ...projectSnap.data()
        }
        return { success: true }
      } else {
        error.value = 'Projet introuvable'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = 'Erreur lors du chargement du projet'
      console.error(err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Récupérer les tâches d'un projet en temps réel
  const fetchTasks = (projectId) => {
    if (tasksUnsubscribe) tasksUnsubscribe()

    const q = query(
      collection(db, 'projects', projectId, 'tasks'),
      orderBy('createdAt', 'desc')
    )

    tasksUnsubscribe = onSnapshot(
      q,
      (snapshot) => {
        tasks.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      },
      (err) => {
        error.value = 'Erreur lors du chargement des tâches'
        console.error(err)
      }
    )
  }

  // Créer une tâche
  const createTask = async (projectId, taskData) => {
    try {
      error.value = null

      await addDoc(collection(db, 'projects', projectId, 'tasks'), {
        ...taskData,
        status: taskData.status || 'todo',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de la création de la tâche'
      console.error(err)
      return { success: false, error: error.value }
    }
  }

  // Mettre à jour une tâche
  const updateTask = async (projectId, taskId, taskData) => {
    try {
      error.value = null

      const taskRef = doc(db, 'projects', projectId, 'tasks', taskId)
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: serverTimestamp()
      })

      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour de la tâche'
      console.error(err)
      return { success: false, error: error.value }
    }
  }

  // Supprimer une tâche
  const deleteTask = async (projectId, taskId) => {
    try {
      error.value = null

      await deleteDoc(doc(db, 'projects', projectId, 'tasks', taskId))

      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de la suppression de la tâche'
      console.error(err)
      return { success: false, error: error.value }
    }
  }

  // Nettoyer les listeners
  const cleanup = () => {
    if (projectsUnsubscribe) projectsUnsubscribe()
    if (tasksUnsubscribe) tasksUnsubscribe()
    projects.value = []
    tasks.value = []
    currentProject.value = null
  }

  return {
    projects,
    currentProject,
    tasks,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    fetchProject,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    cleanup
  }
})