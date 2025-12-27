import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, googleProvider } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Initialiser l'observateur d'authentification
  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          }
        } else {
          user.value = null
        }
        loading.value = false
        resolve(firebaseUser)
      })
    })
  }

  // Inscription avec email/mot de passe
  const register = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      }
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Connexion avec email/mot de passe
  const login = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      }
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Connexion avec Google
  const loginWithGoogle = async () => {
    try {
      error.value = null
      loading.value = true
      const result = await signInWithPopup(auth, googleProvider)
      user.value = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      }
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // Traduire les erreurs Firebase en français
  const getErrorMessage = (code) => {
    const messages = {
      'auth/email-already-in-use': 'Cet email est déjà utilisé',
      'auth/invalid-email': 'Email invalide',
      'auth/operation-not-allowed': 'Opération non autorisée',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/user-not-found': 'Aucun compte avec cet email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/popup-closed-by-user': 'Connexion annulée',
      'auth/cancelled-popup-request': 'Connexion annulée'
    }
    return messages[code] || 'Une erreur est survenue'
  }

  return {
    user,
    loading,
    error,
    initAuth,
    register,
    login,
    loginWithGoogle,
    logout
  }
})