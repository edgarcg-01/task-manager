<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center px-6 py-8">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CheckSquare class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p class="text-xs text-gray-500">Gestión inteligente</p>
            </div>
          </div>
        </div>

        <!-- User Info -->
        <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 mx-4 rounded-xl mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User class="h-4 w-4 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500">{{ taskStore.tasks.length }} tareas</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-2">
          <router-link
            to="/dashboard"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'Dashboard' }"
          >
            <BarChart3 class="h-5 w-5" />
            <span>Dashboard</span>
          </router-link>
          
          <router-link
            to="/tasks"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'TaskList' }"
          >
            <ListTodo class="h-5 w-5" />
            <span>Mis Tareas</span>
            <div class="ml-auto px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              {{ taskStore.tasks.length }}
            </div>
          </router-link>
          
          <router-link
            to="/tasks/new"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'TaskCreate' }"
          >
            <Plus class="h-5 w-5" />
            <span>Nueva Tarea</span>
          </router-link>

          <!-- Quick Stats -->
          <div class="pt-4 space-y-2">
            <div class="px-3 py-2 bg-red-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <AlertCircle class="h-4 w-4 text-red-500" />
                  <span class="text-sm text-red-700">Urgentes</span>
                </div>
                <span class="text-sm font-semibold text-red-600">{{ taskStore.urgentTasks.length }}</span>
              </div>
            </div>
            
            <div class="px-3 py-2 bg-yellow-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <Clock class="h-4 w-4 text-yellow-500" />
                  <span class="text-sm text-yellow-700">Pendientes</span>
                </div>
                <span class="text-sm font-semibold text-yellow-600">{{ taskStore.pendingTasks.length }}</span>
              </div>
            </div>
          </div>
        </nav>

        <!-- Logout Button -->
        <div class="p-4">
          <button
            @click="handleLogout"
            class="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <LogOut class="h-4 w-4" />
            <span class="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Bar -->
      <header class="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div class="px-8 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ getPageTitle() }}</h2>
              <p class="text-sm text-gray-500">{{ getPageSubtitle() }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  class="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell class="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useTaskStore } from '../stores/tasks.js'
import { 
  CheckSquare, User, BarChart3, ListTodo, Plus, AlertCircle, 
  Clock, LogOut, Search, Bell 
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const handleLogout = () => {
  authStore.logout()
  taskStore.clearTasks()
  router.push('/login')
}

const getPageTitle = () => {
  const titles = {
    'Dashboard': 'Dashboard',
    'TaskList': 'Mis Tareas',
    'TaskCreate': 'Nueva Tarea',
    'TaskEdit': 'Editar Tarea'
  }
  return titles[router.currentRoute.value.name] || 'TaskFlow'
}

const getPageSubtitle = () => {
  const subtitles = {
    'Dashboard': 'Resumen de tu productividad',
    'TaskList': 'Gestiona todas tus tareas',
    'TaskCreate': 'Crea una nueva tarea',
    'TaskEdit': 'Modifica tu tarea'
  }
  return subtitles[router.currentRoute.value.name] || 'Gestión inteligente de tareas'
}
</script>

<style scoped>
.nav-item {
  @apply flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group;
}

.nav-item-active {
  @apply bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105;
}
</style>
