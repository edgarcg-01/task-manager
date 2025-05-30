<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative">
        <h1 class="text-3xl font-bold mb-2">¡Bienvenido de vuelta, {{ authStore.user?.name }}! 👋</h1>
        <p class="text-blue-100 text-lg">Aquí tienes un resumen de tu productividad</p>
      </div>
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div class="stat-icon">
          <ListTodo class="h-8 w-8" />
        </div>
        <div>
          <p class="text-blue-100">Total Tareas</p>
          <p class="text-3xl font-bold">{{ taskStore.tasks.length }}</p>
        </div>
      </div>

      <div class="stat-card bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
        <div class="stat-icon">
          <Clock class="h-8 w-8" />
        </div>
        <div>
          <p class="text-yellow-100">Pendientes</p>
          <p class="text-3xl font-bold">{{ taskStore.pendingTasks.length }}</p>
        </div>
      </div>

      <div class="stat-card bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
        <div class="stat-icon">
          <Zap class="h-8 w-8" />
        </div>
        <div>
          <p class="text-purple-100">En Progreso</p>
          <p class="text-3xl font-bold">{{ taskStore.inProgressTasks.length }}</p>
        </div>
      </div>

      <div class="stat-card bg-gradient-to-br from-green-500 to-emerald-500 text-white">
        <div class="stat-icon">
          <CheckCircle class="h-8 w-8" />
        </div>
        <div>
          <p class="text-green-100">Completadas</p>
          <p class="text-3xl font-bold">{{ taskStore.completedTasks.length }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Tasks -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-blue-100 rounded-xl">
                  <Calendar class="h-5 w-5 text-blue-600" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900">Tareas Recientes</h3>
              </div>
              <router-link
                  to="/tasks"
                  class="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>Ver todas</span>
                <ArrowRight class="h-4 w-4" />
              </router-link>
            </div>
          </div>

          <div class="p-6">
            <div v-if="recentTasks.length === 0" class="text-center py-12">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus class="h-10 w-10 text-gray-400" />
              </div>
              <p class="text-gray-500 mb-4">No hay tareas recientes</p>
              <router-link
                  to="/tasks/new"
                  class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105"
              >
                <Plus class="h-4 w-4" />
                <span>Crear primera tarea</span>
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div
                  v-for="task in recentTasks"
                  :key="task.id"
                  class="task-item"
              >
                <div class="flex items-center space-x-4">
                  <div class="task-priority-indicator" :class="getPriorityClass(task.priority)"></div>
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ task.title }}</h4>
                    <div class="flex items-center space-x-4 mt-1">
                      <span :class="getPriorityBadge(task.priority)">
                        {{ getPriorityLabel(task.priority) }}
                      </span>
                      <span :class="getStatusBadge(task.status)">
                        {{ getStatusLabel(task.status) }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">{{ formatDate(task.endDate) }}</p>
                    <div class="text-xs" :class="getDaysRemainingClass(task)">
                      {{ getDaysRemainingText(task) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Progress -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-2 bg-purple-100 rounded-xl">
              <Zap class="h-5 w-5 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Acciones Rápidas</h3>
          </div>

          <div class="space-y-3">
            <router-link to="/tasks/new" class="action-button bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              <Plus class="h-5 w-5" />
              <span>Nueva Tarea</span>
            </router-link>

            <router-link to="/tasks?status=pending" class="action-button bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <Clock class="h-5 w-5" />
              <span>Ver Pendientes</span>
            </router-link>

            <router-link to="/tasks?priority=urgent" class="action-button bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
              <AlertCircle class="h-5 w-5" />
              <span>Tareas Urgentes</span>
            </router-link>
          </div>
        </div>

        <!-- Progress Overview -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-2 bg-green-100 rounded-xl">
              <TrendingUp class="h-5 w-5 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Progreso</h3>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Completadas</span>
                <span class="font-medium">{{ completionPercentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                    class="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    :style="{ width: `${completionPercentage}%` }"
                ></div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ taskStore.completedTasks.length }}</div>
                <div class="text-xs text-gray-500">Completadas</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ taskStore.pendingTasks.length + taskStore.inProgressTasks.length }}</div>
                <div class="text-xs text-gray-500">Restantes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useTaskStore } from '../stores/tasks.js'
import {
  ListTodo, Clock, Zap, CheckCircle, Calendar, ArrowRight, Plus,
  AlertCircle, TrendingUp
} from 'lucide-vue-next'

const authStore = useAuthStore()
const taskStore = useTaskStore()

const recentTasks = computed(() =>
    taskStore.tasks
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
)

const completionPercentage = computed(() => {
  if (taskStore.tasks.length === 0) return 0
  return Math.round((taskStore.completedTasks.length / taskStore.tasks.length) * 100)
})

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  })
}

const getPriorityClass = (priority) => {
  const classes = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-400',
    urgent: 'bg-red-400'
  }
  return classes[priority] || 'bg-gray-400'
}

const getPriorityBadge = (priority) => {
  const badges = {
    low: 'priority-badge bg-green-100 text-green-700',
    medium: 'priority-badge bg-yellow-100 text-yellow-700',
    high: 'priority-badge bg-orange-100 text-orange-700',
    urgent: 'priority-badge bg-red-100 text-red-700'
  }
  return badges[priority] || 'priority-badge bg-gray-100 text-gray-700'
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

const getStatusBadge = (status) => {
  const badges = {
    pending: 'status-badge bg-gray-100 text-gray-700',
    'in-progress': 'status-badge bg-blue-100 text-blue-700',
    completed: 'status-badge bg-green-100 text-green-700'
  }
  return badges[status] || 'status-badge bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    'in-progress': 'En Progreso',
    completed: 'Completada'
  }
  return labels[status] || status
}

const getDaysRemaining = (task) => {
  const end = new Date(task.endDate)
  const now = new Date()
  const diffTime = end - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getDaysRemainingText = (task) => {
  const days = getDaysRemaining(task)

  if (task.status === 'completed') return 'Completada'
  if (days < 0) return `${Math.abs(days)} días vencida`
  if (days === 0) return 'Vence hoy'
  if (days === 1) return 'Vence mañana'
  return `${days} días restantes`
}

const getDaysRemainingClass = (task) => {
  const days = getDaysRemaining(task)

  if (task.status === 'completed') return 'text-green-600 font-medium'
  if (days < 0) return 'text-red-600 font-medium'
  if (days <= 3) return 'text-orange-600 font-medium'
  return 'text-gray-500'
}
</script>

<style scoped>
.stat-card {
  @apply p-6 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-200;
}

.stat-icon {
  @apply p-3 bg-white/20 rounded-xl mb-4;
}

.task-item {
  @apply p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors;
}

.task-priority-indicator {
  @apply w-1 h-12 rounded-full;
}

.action-button {
  @apply w-full flex items-center space-x-3 p-4 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg;
}

.priority-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.status-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}
</style>
