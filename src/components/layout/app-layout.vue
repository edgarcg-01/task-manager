<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <router-link to="/dashboard" class="text-2xl font-bold text-gray-900 hover:text-blue-600">
              Gestor de Tareas
            </router-link>
            <span class="text-sm text-gray-600">Bienvenido, {{ authStore.user?.name }}</span>
          </div>
          
          <nav class="flex items-center space-x-4">
            <router-link
              to="/dashboard"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                $route.name === 'Dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Dashboard
            </router-link>
            
            <router-link
              to="/tasks"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                $route.name === 'TaskList'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Tareas ({{ taskStore.tasks.length }})
            </router-link>
            
            <router-link
              to="/tasks/new"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                $route.name === 'TaskForm'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Nueva Tarea
            </router-link>
            
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
