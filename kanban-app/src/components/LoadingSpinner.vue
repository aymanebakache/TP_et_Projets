<template>
    <div class="flex items-center justify-center" :class="containerClass">
      <div 
        class="animate-spin rounded-full border-b-2"
        :class="[sizeClass, colorClass]"
      ></div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    size: {
      type: String,
      default: 'md', // sm, md, lg
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    color: {
      type: String,
      default: 'primary' // primary, white
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  })
  
  const sizeClass = computed(() => {
    const sizes = {
      sm: 'h-6 w-6',
      md: 'h-12 w-12',
      lg: 'h-16 w-16'
    }
    return sizes[props.size]
  })
  
  const colorClass = computed(() => {
    return props.color === 'white' ? 'border-white' : 'border-primary-600'
  })
  
  const containerClass = computed(() => {
    return props.fullScreen ? 'min-h-screen' : 'py-8'
  })
  </script>