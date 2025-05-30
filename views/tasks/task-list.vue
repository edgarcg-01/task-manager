<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Lista de Tareas</h1>
      <router-link
        to="/tasks/new"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Nueva Tarea
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label for="filterPriority" class="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Prioridad
          </label>
          <select
            id="filterPriority"
            v-model="filters.priority"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>

        <div>
          <label for="filterStatus" class="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Estado
          </label>
          <select
            id="filterStatus"
            v-model="filters.status"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="in-progress">En Progreso</option>
            <option value="completed">Completada</option>
          </select>
        </div>

        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            placeholder="Buscar tareas..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Lista de Tareas -->
    <div v-if="filteredTasks.length === 0" class="text-center py-12">
      <div class="text-gray-500 text-lg">No hay tareas que coincidan con los filtros</div>
      <router-link
        to="/tasks/new"
        class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Crear primera tarea
      </router-link>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ task.title }}</h3>
            <p v-if="task.description" class="text-gray-600 mb-3">{{ task.description }}</p>
            
            <!-- Badges -->
            <div class="flex flex-wrap gap-2 mb-3">
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

            <!-- Fechas y Progreso -->
            <div class="space-y-2">
              <div class="text-sm text-gray-600">
                <span class="font-medium">Inicio:</span> {{ formatDate(task.startDate) }} |
                <span class="font-medium">Fin:</span> {{ formatDate(task.endDate) }}
              </div>
              
              <!-- Barra de Progreso -->
              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{{ Math.round(getTaskProgress(task)) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    :class="[
                      'h-2 rounded-full transition-all duration-300',
                      task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    ]"
                    :style="{ width: `${getTaskProgress(task)}%` }"
                  ></div>
                </div>
              </div>

              <!-- Días restantes -->
              <div class="text-sm">
                <span
                  :class="[
                    'font-medium',
                    getDaysRemaining(task) < 0 ? 'text-red-600' : 
                    getDaysRemaining(task) <= 3 ? 'text-orange-600' : 'text-green-600'
                  ]"
                >
                  {{ getDaysRemainingText(task) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex space-x-2 ml-4">
            <router-link
              :to="`/tasks/${task.id}/edit`"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar tarea"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </router-link>
            <button
              @click="deleteTask(task.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar tarea"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '../../stores/tasks'

const route = useRoute()
const taskStore = useTaskStore()

const filters = reactive({
  priority: '',
  status: '',
  search: ''
})

const filteredTasks = computed(() => {
  let filtered = taskStore.tasks

  if (filters.priority) {
    filtered = filtered.filter(task => task.priority === filters.priority)
  }

  if (filters.status) {
    filtered = filtered.filter(task => task.status === filters.status)
  }

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search)
    )
  }

  return filtered.sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
})

const deleteTask = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    taskStore.deleteTask(id)
  }
}

// Funciones auxiliares (iguales que antes)
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
  const diffTime = end - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getDaysRemainingText = (task) => {
  const days = getDaysRemaining(task)
  
  if (task.status === 'completed') {
    return 'Completada'
  }
  
  if (days < 0) {
    return `Vencida hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? 's' : ''}`
  } else if (days === 0) {
    return 'Vence hoy'
  } else if (days === 1) {
    return 'Vence mañana'
  } else {
    return `${days} días restantes`
  }
}

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

// Aplicar filtros desde query params
onMounted(() => {
  if (route.query.priority) {
    filters.priority = route.query.priority
  }
  if (route.query.status) {
    filters.status = route.query.status
  }
  if (route.query.search) {
    filters.search = route.query.search
  }
})
</script>
