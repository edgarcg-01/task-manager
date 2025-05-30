<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { useTaskStore } from '../../stores/tasks.js'

const authStore = useAuthStore()
const taskStore = useTaskStore()

onMounted(() => {
  authStore.checkAuth()
  taskStore.loadTasks()
})
</script>
