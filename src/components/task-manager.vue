<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold text-gray-900">Gestor de Tareas</h1>
          <div class="flex space-x-4">
            <button
              @click="activeTab = 'form'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'form'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Nueva Tarea
            </button>
            <button
              @click="activeTab = 'list'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Lista de Tareas ({{ taskStore.tasks.length }})
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Form Tab -->
      <div v-if="activeTab === 'form'" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            {{ editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea' }}
          </h2>
          
          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Título -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.title ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Ingresa el título de la tarea"
              />
              <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
            </div>

            <!-- Descripción -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe la tarea (opcional)"
              ></textarea>
            </div>

            <!-- Prioridad -->
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                Prioridad *
              </label>
              <select
                id="priority"
                v-model="form.priority"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.priority ? 'border-red-500' : 'border-gray-300'
                ]"
              >
                <option value="">Selecciona una prioridad</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
              <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
            </div>

            <!-- Fechas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  id="startDate"
                  v-model="form.startDate"
                  type="date"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  ]"
                />
                <p v-if="errors.startDate" class="mt-1 text-sm text-red-600">{{ errors.startDate }}</p>
              </div>

              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin *
                </label>
                <input
                  id="endDate"
                  v-model="form.endDate"
                  type="date"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  ]"
                />
                <p v-if="errors.endDate" class="mt-1 text-sm text-red-600">{{ errors.endDate }}</p>
              </div>
            </div>

            <!-- Estado -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="status"
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pendiente</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completada</option>
              </select>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-4">
              <button
                v-if="editingTask"
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ editingTask ? 'Actualizar' : 'Crear' }} Tarea
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- List Tab -->
      <div v-else-if="activeTab === 'list'">
        <!-- Filtros -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
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
                <button
                  @click="editTask(task)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar tarea"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
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
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { createPinia } from 'pinia'

// Crear instancia de Pinia
const pinia = createPinia()

// Store de Pinia para manejar las tareas
const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    nextId: 1
  }),
  
  actions: {
    addTask(task) {
      const newTask = {
        ...task,
        id: this.nextId++,
        createdAt: new Date().toISOString()
      }
      this.tasks.push(newTask)
      this.saveTasks()
    },
    
    updateTask(id, updatedTask) {
      const index = this.tasks.findIndex(task => task.id === id)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedTask }
        this.saveTasks()
      }
    },
    
    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id)
      this.saveTasks()
    },
    
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
      localStorage.setItem('nextId', this.nextId.toString())
    },
    
    loadTasks() {
      const savedTasks = localStorage.getItem('tasks')
      const savedNextId = localStorage.getItem('nextId')
      
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks)
      }
      
      if (savedNextId) {
        this.nextId = parseInt(savedNextId)
      }
    }
  }
})

// Usar el store
const taskStore = useTaskStore(pinia)

// Estado reactivo
const activeTab = ref('form')
const editingTask = ref(null)

const form = reactive({
  title: '',
  description: '',
  priority: '',
  startDate: '',
  endDate: '',
  status: 'pending'
})

const errors = reactive({
  title: '',
  priority: '',
  startDate: '',
  endDate: ''
})

const filters = reactive({
  priority: '',
  status: '',
  search: ''
})

// Computed properties
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

// Métodos
const validateForm = () => {
  // Limpiar errores
  Object.keys(errors).forEach(key => errors[key] = '')

  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'El título es requerido'
    isValid = false
  }

  if (!form.priority) {
    errors.priority = 'La prioridad es requerida'
    isValid = false
  }

  if (!form.startDate) {
    errors.startDate = 'La fecha de inicio es requerida'
    isValid = false
  }

  if (!form.endDate) {
    errors.endDate = 'La fecha de fin es requerida'
    isValid = false
  }

  if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
    errors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio'
    isValid = false
  }

  return isValid
}

const submitForm = () => {
  if (!validateForm()) return

  const taskData = { ...form }

  if (editingTask.value) {
    taskStore.updateTask(editingTask.value.id, taskData)
    editingTask.value = null
  } else {
    taskStore.addTask(taskData)
  }

  resetForm()
  activeTab.value = 'list'
}

const resetForm = () => {
  Object.assign(form, {
    title: '',
    description: '',
    priority: '',
    startDate: '',
    endDate: '',
    status: 'pending'
  })
  Object.keys(errors).forEach(key => errors[key] = '')
}

const editTask = (task) => {
  editingTask.value = task
  Object.assign(form, {
    title: task.title,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    endDate: task.endDate,
    status: task.status
  })
  activeTab.value = 'form'
}

const cancelEdit = () => {
  editingTask.value = null
  resetForm()
  activeTab.value = 'list'
}

const deleteTask = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    taskStore.deleteTask(id)
  }
}

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

// Lifecycle
onMounted(() => {
  taskStore.loadTasks()
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
