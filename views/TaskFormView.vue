<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white/20 rounded-xl">
              <Plus v-if="!isEditing" class="h-6 w-6" />
              <Edit3 v-else class="h-6 w-6" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">
                {{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}
              </h1>
              <p class="text-blue-100">
                {{ isEditing ? 'Modifica los detalles de tu tarea' : 'Crea una nueva tarea para tu proyecto' }}
              </p>
            </div>
          </div>
          <router-link
              to="/tasks"
              class="p-2 hover:bg-white/20 rounded-xl transition-colors"
              title="Cerrar"
          >
            <X class="h-6 w-6" />
          </router-link>
        </div>
      </div>

      <!-- Form -->
      <div class="p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <div class="form-group">
            <label for="title" class="form-label">
              <Type class="h-4 w-4" />
              Título de la tarea *
            </label>
            <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="form-input"
                :class="{ 'border-red-300 bg-red-50': errors.title }"
                placeholder="Ejemplo: Completar informe mensual"
            />
            <p v-if="errors.title" class="error-message">{{ errors.title }}</p>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description" class="form-label">
              <FileText class="h-4 w-4" />
              Descripción
            </label>
            <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="form-input resize-none"
                placeholder="Describe los detalles de la tarea (opcional)"
            ></textarea>
          </div>

          <!-- Priority and Status Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Priority -->
            <div class="form-group">
              <label for="priority" class="form-label">
                <Target class="h-4 w-4" />
                Prioridad *
              </label>
              <select
                  id="priority"
                  v-model="form.priority"
                  required
                  class="form-input"
                  :class="{ 'border-red-300 bg-red-50': errors.priority }"
              >
                <option value="">Selecciona prioridad</option>
                <option value="low">🟢 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🟠 Alta</option>
                <option value="urgent">🔴 Urgente</option>
              </select>
              <p v-if="errors.priority" class="error-message">{{ errors.priority }}</p>
            </div>

            <!-- Status -->
            <div class="form-group">
              <label for="status" class="form-label">
                <BarChart3 class="h-4 w-4" />
                Estado actual
              </label>
              <select
                  id="status"
                  v-model="form.status"
                  class="form-input"
              >
                <option value="pending">⏳ Pendiente</option>
                <option value="in-progress">🔄 En Progreso</option>
                <option value="completed">✅ Completada</option>
              </select>
            </div>
          </div>

          <!-- Dates Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Start Date -->
            <div class="form-group">
              <label for="startDate" class="form-label">
                <Calendar class="h-4 w-4" />
                Fecha de inicio *
              </label>
              <input
                  id="startDate"
                  v-model="form.startDate"
                  type="date"
                  required
                  class="form-input"
                  :class="{ 'border-red-300 bg-red-50': errors.startDate }"
              />
              <p v-if="errors.startDate" class="error-message">{{ errors.startDate }}</p>
            </div>

            <!-- End Date -->
            <div class="form-group">
              <label for="endDate" class="form-label">
                <CalendarCheck class="h-4 w-4" />
                Fecha de finalización *
              </label>
              <input
                  id="endDate"
                  v-model="form.endDate"
                  type="date"
                  required
                  class="form-input"
                  :class="{ 'border-red-300 bg-red-50': errors.endDate }"
              />
              <p v-if="errors.endDate" class="error-message">{{ errors.endDate }}</p>
            </div>
          </div>

          <!-- General Error -->
          <div v-if="errors.general" class="error-alert">
            <AlertCircle class="h-4 w-4" />
            <span>{{ errors.general }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <router-link
                to="/tasks"
                class="cancel-button"
            >
              <X class="h-4 w-4" />
              <span>Cancelar</span>
            </router-link>
            <button
                type="submit"
                :disabled="loading"
                class="submit-button"
            >
              <Loader v-if="loading" class="h-5 w-5 animate-spin" />
              <Save v-else-if="isEditing" class="h-5 w-5" />
              <Plus v-else class="h-5 w-5" />
              <span>
                {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Tarea' : 'Crear Tarea') }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../stores/tasks.js'
import {
  Plus, Edit3, X, Type, FileText, Target, BarChart3, Calendar,
  CalendarCheck, AlertCircle, Loader, Save
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const loading = ref(false)
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
  endDate: '',
  general: ''
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
    errors.endDate = 'La fecha de fin debe ser posterior a la de inicio'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  errors.general = ''

  try {
    const taskData = { ...form }

    if (isEditing.value) {
      const updated = taskStore.updateTask(parseInt(route.params.id), taskData)
      if (!updated) {
        errors.general = 'No se pudo actualizar la tarea'
        return
      }
    } else {
      taskStore.addTask(taskData)
    }

    router.push('/tasks')
  } catch (error) {
    errors.general = 'Error al guardar la tarea'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEditing.value) {
    const task = taskStore.getTaskById(route.params.id)
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

<style scoped>
.form-group {
  @apply space-y-3;
}

.form-label {
  @apply flex items-center space-x-2 text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400;
}

.error-message {
  @apply text-xs text-red-600 flex items-center space-x-1;
}

.error-alert {
  @apply flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm;
}

.cancel-button {
  @apply inline-flex items-center space-x-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all;
}

.submit-button {
  @apply inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}
</style>
