<template>
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <!-- Hero Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Gérez vos projets avec
            <span class="text-primary-600">Kanban Pro</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Une application simple et intuitive pour organiser vos tâches en mode Kanban. 
            Visualisez votre flux de travail et boostez votre productivité.
          </p>
          <router-link 
            to="/auth" 
            class="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Commencer gratuitement
          </router-link>
        </div>
  
        <!-- Features -->
        <div class="grid md:grid-cols-3 gap-8 mt-20">
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Organisation visuelle
            </h3>
            <p class="text-gray-600">
              Organisez vos tâches en colonnes To Do, Doing et Done. Déplacez-les facilement par glisser-déposer.
            </p>
          </div>
  
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Temps réel
            </h3>
            <p class="text-gray-600">
              Synchronisation instantanée de vos données grâce à Firebase. Accédez à vos projets partout.
            </p>
          </div>
  
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Sécurisé
            </h3>
            <p class="text-gray-600">
              Vos données sont sécurisées et privées. Authentification sécurisée avec Firebase Auth.
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Page d'accueil - Simple présentation
  </script>