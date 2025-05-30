<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mis Tareas</h1>
        <p class="text-gray-600">{{ filteredTasks.length }} de {{ taskStore.tasks.length }} tareas</p>
      </div>
      <router-link
          to="/tasks/new"
          class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
      >
        <Plus class="h-5 w-5" />
        <span>Nueva Tarea</span>
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div class="flex items-center space-x-3 mb-4">
        <div class="p-2 bg-purple-100 rounded-xl">
          <Filter class="h-5 w-5 text-purple-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Filtros</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="filter-group">
          <label class="filter-label">
            <Target class="h-4 w-4" />
            Prioridad
          </label>
          <select v-model="filters.priority" class="filter-select">
            <option value="">Todas</option>
            <option value="low">🟢 Baja</option>
            <option value="medium">🟡 Media</option>
            <option value="high">🟠 Alta</option>
            <option value="urgent">🔴 Urgente</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <BarChart3 class="h-4 w-4" />
            Estado
          </label>
          <select v-model="filters.status" class="filter-select">
            <option value="">Todos</option>
            <option value="pending">⏳ Pendiente</option>
            <option value="in-progress">🔄 En Progreso</option>
            <option value="completed">✅ Completada</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <Search class="h-4 w-4" />
            Buscar
          </label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
                v-model="filters.search"
                type="text"
                placeholder="Buscar tareas..."
                class="filter-select pl-10"
            />
          </div>
        </div>

        <div class="flex items-end">
          <button
              @click="clearFilters"
              class="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <X class="h-4 w-4" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tasks Grid -->
    <div v-if="filteredTasks.length === 0" class="text-center py-16">
      <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Search class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        {{ taskStore.tasks.length === 0 ? 'No tienes tareas' : 'No se encontraron tareas' }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{ taskStore.tasks.length === 0 ? 'Crea tu primera tarea para comenzar' : 'Prueba ajustando los filtros' }}
      </p>
      <router-link
          to="/tasks/new"
          class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105"
      >
        <Plus class="h-5 w-5" />
        <span>{{ taskStore.tasks.length === 0 ? 'Crear primera tarea' : 'Nueva tarea' }}</span>
      </router-link>
    </div>

    <div v-else class="grid gap-6">
      <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-card group"
      >
        <!-- Priority indicator -->
        <div class="task-priority-bar" :class="getPriorityColor(task.priority)"></div>

        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {{ task.title }}
              </h3>
              <p v-if="task.description" class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ task.description }}
              </p>

              <!-- Tags -->
              <div class="flex items-center space-x-3 mb-4">
                <span :class="getPriorityBadge(task.priority)">
                  <Target class="h-3 w-3" />
                  {{ getPriorityLabel(task.priority) }}
                </span>
                <span :class="getStatusBadge(task.status)">
                  <Circle class="h-3 w-3" />
                  {{ getStatusLabel(task.status) }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <router-link
                  :to="`/tasks/${task.id}/edit`"
                  class="action-btn text-blue-600 hover:bg-blue-50"
                  title="Editar tarea"
              >
                <Edit3 class="h-4 w-4" />
              </router-link>
              <button
                  @click="confirmDelete(task)"
                  class="action-btn text-red-600 hover:bg-red-50"
                  title="Eliminar tarea"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Dates and Progress -->
          <div class="space-y-4">
            <div class="flex items-center justify-between text-sm text-gray-600">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-1">
                  <Calendar class="h-4 w-4" />
                  <span>{{ formatDate(task.startDate) }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Clock class="h-4 w-4" />
                  <span>{{ formatDate(task.endDate) }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-1" :class="getDaysRemainingClass(task)">
                <AlertCircle class="h-4 w-4" />
                <span class="font-medium">{{ getDaysRemainingText(task) }}</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Progreso</span>
                <span class="font-medium text-gray-900">{{ Math.round(getTaskProgress(task)) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="task.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'"
                    :style="{ width: `${getTaskProgress(task)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '../stores/tasks.js'
import {
  Plus, Filter, Target, BarChart3, Search, X, Edit3, Trash2,
  Calendar, Clock, AlertCircle, Circle
} from 'lucide-vue-next'

const route = useRoute()
const taskStore = useTaskStore()

const filters = reactive({
  priority: '',
  status: '',
  search: ''
})

const filteredTasks = computed(() => {
  return taskStore.filterTasks(filters)
})

const clearFilters = () => {
  Object.assign(filters, { priority: '', status: '', search: '' })
}

const confirmDelete = (task) => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${task.title}"?`)) {
    taskStore.deleteTask(task.id)
  }
}

// Utility functions
const getTaskProgress = (task) => {
  if (task.status === 'completed') return 100
  const start = new Date(task.startDate)
  const end = new Date(task.endDate)
  const now = new Date()
  if (now < start) return 0
  if (now > end) return 100
  const total = end - start
  const elapsed = now - start
  return Math.max(0, Math.min(100, (elapsed / total) * 100))
}

const getDaysRemaining = (task) => {
  const end = new Date(task.endDate)
  const now = new Date()
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
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
  if (task.status === 'completed') return 'text-green-600'
  if (days < 0) return 'text-red-600'
  if (days <= 3) return 'text-orange-600'
  return 'text-gray-600'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  })
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-400',
    urgent: 'bg-red-400'
  }
  return colors[priority] || 'bg-gray-400'
}

const getPriorityBadge = (priority) => {
  const badges = {
    low: 'priority-badge bg-green-100 text-green-700 border-green-200',
    medium: 'priority-badge bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'priority-badge bg-orange-100 text-orange-700 border-orange-200',
    urgent: 'priority-badge bg-red-100 text-red-700 border-red-200'
  }
  return badges[priority] || 'priority-badge bg-gray-100 text-gray-700 border-gray-200'
}

const getPriorityLabel = (priority) => {
  const labels = { low: 'Baja', medium: 'Media', high: 'Alta', urgent: 'Urgente' }
  return labels[priority] || priority
}

const getStatusBadge = (status) => {
  const badges = {
    pending: 'status-badge bg-gray-100 text-gray-700 border-gray-200',
    'in-progress': 'status-badge bg-blue-100 text-blue-700 border-blue-200',
    completed: 'status-badge bg-green-100 text-green-700 border-green-200'
  }
  return badges[status] || 'status-badge bg-gray-100 text-gray-700 border-gray-200'
}

const getStatusLabel = (status) => {
  const labels = { pending: 'Pendiente', 'in-progress': 'En Progreso', completed: 'Completada' }
  return labels[status] || status
}

onMounted(() => {
  if (route.query.priority) filters.priority = route.query.priority
  if (route.query.status) filters.status = route.query.status
  if (route.query.search) filters.search = route.query.search
})
</script>

<style scoped>
.filter-group {
  @apply space-y-2;
}

.filter-label {
  @apply flex items-center space-x-2 text-sm font-medium text-gray-700;
}

.filter-select {
  @apply w-full px-3 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all;
}

.task-card {
  @apply relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 overflow-hidden;
}

.task-priority-bar {
  @apply absolute top-0 left-0 right-0 h-1;
}

.action-btn {
  @apply p-2 rounded-xl transition-all hover:scale-110;
}

.priority-badge {
  @apply inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border;
}

.status-badge {
  @apply inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
