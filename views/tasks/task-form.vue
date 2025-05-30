<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}
        </h1>
        <router-link
          to="/tasks"
          class="text-gray-600 hover:text-gray-800"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </router-link>
      </div>
      
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
          <router-link
            to="/tasks"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ isEditing ? 'Actualizar' : 'Crear' }} Tarea
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../../stores/tasks'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const isEditing = computed(() => !!route.params.id)

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

const validateForm = () => {
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

  if (isEditing.value) {
    taskStore.updateTask(parseInt(route.params.id), taskData)
  } else {
    taskStore.addTask(taskData)
  }

  router.push('/tasks')
}

onMounted(() => {
  if (isEditing.value) {
    const task = taskStore.tasks.find(t => t.id === parseInt(route.params.id))
    if (task) {
      Object.assign(form, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        endDate: task.endDate,
        status: task.status
      })
    } else {
      router.push('/tasks')
    }
  }
})
</script>
