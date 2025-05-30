<template>
  <div class="space-y-6">
    <!-- Header del Dashboard -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Resumen de tus tareas y productividad</p>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h9.5M9 5a2 2 0 002 2h5a2 2 0 002-2M9 5a2 2 0 012-2h5a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Tareas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ taskStore.tasks.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pendientes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ pendingTasks }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En Progreso</p>
            <p class="text-2xl font-semibold text-gray-900">{{ inProgressTasks }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Completadas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ completedTasks }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tareas Recientes -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Tareas Recientes</h2>
        <router-link
            to="/tasks"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Ver todas
        </router-link>
      </div>

      <div v-if="recentTasks.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hay tareas recientes</p>
        <router-link
            to="/tasks/new"
            class="mt-2 inline-block text-blue-600 hover:text-blue-700 font-medium"
        >
          Crear tu primera tarea
        </router-link>
      </div>

      <div v-else class="space-y-3">
        <div
            v-for="task in recentTasks"
            :key="task.id"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
            <div class="flex items-center space-x-2 mt-1">
              <span
                  :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getPriorityColor(task.priority)
                ]"
              >
                {{ getPriorityLabel(task.priority) }}
              </span>
              <span
                  :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(task.status)
                ]"
              >
                {{ getStatusLabel(task.status) }}
              </span>
            </div>
          </div>
          <div class="text-sm text-gray-500">
            {{ formatDate(task.endDate) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones Rápidas -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
            to="/tasks/new"
            class="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <div>
            <p class="font-medium text-gray-900">Nueva Tarea</p>
            <p class="text-sm text-gray-600">Crear una nueva tarea</p>
          </div>
        </router-link>

        <router-link
            to="/tasks?status=pending"
            class="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
        >
          <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="font-medium text-gray-900">Tareas Pendientes</p>
            <p class="text-sm text-gray-600">Ver tareas por hacer</p>
          </div>
        </router-link>

        <router-link
            to="/tasks?priority=urgent"
            class="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
        >
          <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <p class="font-medium text-gray-900">Tareas Urgentes</p>
            <p class="text-sm text-gray-600">Revisar prioridades altas</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '@/stores/tasks'

const taskStore = useTaskStore()

const pendingTasks = computed(() =>
    taskStore.tasks.filter(task => task.status === 'pending').length
)

const inProgressTasks = computed(() =>
    taskStore.tasks.filter(task => task.status === 'in-progress').length
)

const completedTasks = computed(() =>
    taskStore.tasks.filter(task => task.status === 'completed').length
)

const recentTasks = computed(() =>
    taskStore.tasks
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return colors[priority] || 'bg-gray-100 text-gray-800'
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente'
  }
  return labels[priority] || priority
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    'in-progress': 'En Progreso',
    completed: 'Completada'
  }
  return labels[status] || status
}
</script>
