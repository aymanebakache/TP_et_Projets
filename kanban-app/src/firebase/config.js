import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Configuration Firebase - À remplacer par vos propres clés
const firebaseConfig = {
    apiKey: "AIzaSyDvTlIXoQrh_WsSadRg-AtCcUFtdO3Js0E",
    authDomain: "kanban-5e23b.firebaseapp.com",
    projectId: "kanban-5e23b",
    storageBucket: "kanban-5e23b.firebasestorage.app",
    messagingSenderId: "457389669596",
    appId: "1:457389669596:web:e57f1ab8d3349856780819"
}

// Initialisation de Firebase
const app = initializeApp(firebaseConfig)

// Services Firebase
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Configuration du provider Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
})