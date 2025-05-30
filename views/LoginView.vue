<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative max-w-md w-full">
      <!-- Login Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <!-- Header -->
        <div class="p-8 text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckSquare class="h-10 w-10 text-white" />
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            {{ isLogin ? 'Bienvenido' : 'Crear Cuenta' }}
          </h1>
          <p class="text-gray-600">
            {{ isLogin ? 'Inicia sesión en TaskFlow' : 'Únete a TaskFlow' }}
          </p>
        </div>

        <!-- Form -->
        <div class="px-8 pb-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name field (register only) -->
            <div v-if="!isLogin" class="form-group">
              <label for="name" class="form-label">
                <User class="h-4 w-4" />
                Nombre completo
              </label>
              <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input"
                  :class="{ 'border-red-300 bg-red-50': errors.name }"
                  placeholder="Tu nombre completo"
              />
              <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
            </div>

            <!-- Email field -->
            <div class="form-group">
              <label for="email" class="form-label">
                <Mail class="h-4 w-4" />
                Correo electrónico
              </label>
              <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="form-input"
                  :class="{ 'border-red-300 bg-red-50': errors.email }"
                  placeholder="tu@email.com"
              />
              <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
            </div>

            <!-- Password field -->
            <div class="form-group">
              <label for="password" class="form-label">
                <Lock class="h-4 w-4" />
                Contraseña
              </label>
              <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="form-input"
                  :class="{ 'border-red-300 bg-red-50': errors.password }"
                  placeholder="Tu contraseña"
              />
              <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
            </div>

            <!-- Confirm password (register only) -->
            <div v-if="!isLogin" class="form-group">
              <label for="confirmPassword" class="form-label">
                <Shield class="h-4 w-4" />
                Confirmar contraseña
              </label>
              <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  required
                  class="form-input"
                  :class="{ 'border-red-300 bg-red-50': errors.confirmPassword }"
                  placeholder="Confirma tu contraseña"
              />
              <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
            </div>

            <!-- General error -->
            <div v-if="errors.general" class="error-alert">
              <AlertCircle class="h-4 w-4" />
              <span>{{ errors.general }}</span>
            </div>

            <!-- Submit button -->
            <button
                type="submit"
                :disabled="loading"
                class="submit-button"
            >
              <Loader v-if="loading" class="h-5 w-5 animate-spin" />
              <LogIn v-else-if="isLogin" class="h-5 w-5" />
              <UserPlus v-else class="h-5 w-5" />
              <span>{{ loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta') }}</span>
            </button>
          </form>

          <!-- Toggle mode -->
          <div class="mt-6 text-center">
            <p class="text-gray-600 text-sm">
              {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
              <button
                  @click="toggleMode"
                  class="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                {{ isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useTaskStore } from '../stores/tasks.js'
import {
  CheckSquare, User, Mail, Lock, Shield, AlertCircle, Loader,
  LogIn, UserPlus
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const isLogin = ref(true)
const loading = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  general: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  resetForm()
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  Object.keys(errors).forEach(key => errors[key] = '')
}

const validateForm = () => {
  Object.keys(errors).forEach(key => errors[key] = '')
  let isValid = true

  if (!isLogin.value && !form.name.trim()) {
    errors.name = 'El nombre es requerido'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'El email es requerido'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'El email no es válido'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  if (!isLogin.value) {
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña'
      isValid = false
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  errors.general = ''

  try {
    if (isLogin.value) {
      await authStore.login({
        email: form.email,
        password: form.password
      })
    } else {
      await authStore.register({
        name: form.name,
        email: form.email,
        password: form.password
      })
    }

    taskStore.loadTasks()
    router.push('/dashboard')
  } catch (error) {
    errors.general = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-group {
  @apply space-y-2;
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
  @apply flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm;
}

.submit-button {
  @apply w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
