<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 flex items-center justify-center px-4">
    <div class="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-8 sm:p-10 w-full max-w-md transition-all duration-300 ease-in-out">
      <h2 class="text-center text-4xl font-semibold text-gray-900 mb-2">
        {{ isLogin ? 'Inicia Sesión' : 'Crea tu Cuenta' }}
      </h2>
      <p class="text-center text-sm text-gray-600 mb-6">
        {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <button
            @click="toggleAuthMode"
            class="ml-1 text-indigo-600 hover:underline font-medium"
        >
          {{ isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí' }}
        </button>
      </p>

      <form @submit.prevent="handleAuth" class="space-y-5">
        <transition name="fade" mode="out-in">
          <div v-if="!isLogin" key="name">
            <label class="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
                v-model="authForm.name"
                type="text"
                placeholder="Ej. Dayan García"
                class="input-style"
            />
            <p v-if="authErrors.name" class="error-text">{{ authErrors.name }}</p>
          </div>
        </transition>

        <div>
          <label class="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
              v-model="authForm.email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              class="input-style"
          />
          <p v-if="authErrors.email" class="error-text">{{ authErrors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
              v-model="authForm.password"
              type="password"
              placeholder="********"
              class="input-style"
          />
          <p v-if="authErrors.password" class="error-text">{{ authErrors.password }}</p>
        </div>

        <transition name="fade" mode="out-in">
          <div v-if="!isLogin" key="confirmPassword">
            <label class="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input
                v-model="authForm.confirmPassword"
                type="password"
                placeholder="********"
                class="input-style"
            />
            <p v-if="authErrors.confirmPassword" class="error-text">{{ authErrors.confirmPassword }}</p>
          </div>
        </transition>

        <div v-if="authErrors.general" class="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm">
          {{ authErrors.general }}
        </div>

        <button
            type="submit"
            :disabled="authLoading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl shadow transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="authLoading">Procesando...</span>
          <span v-else>{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useTaskStore } from '../../stores/tasks'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const isLogin = ref(true)
const authLoading = ref(false)

const authForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const authErrors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  general: ''
})

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  resetAuthForm()
}

const resetAuthForm = () => {
  Object.assign(authForm, {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  Object.keys(authErrors).forEach(key => authErrors[key] = '')
}

const validateAuthForm = () => {
  Object.keys(authErrors).forEach(key => authErrors[key] = '')
  let isValid = true

  if (!isLogin.value && !authForm.name.trim()) {
    authErrors.name = 'El nombre es requerido'
    isValid = false
  }

  if (!authForm.email.trim()) {
    authErrors.email = 'El email es requerido'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(authForm.email)) {
    authErrors.email = 'El email no es válido'
    isValid = false
  }

  if (!authForm.password) {
    authErrors.password = 'La contraseña es requerida'
    isValid = false
  } else if (authForm.password.length < 6) {
    authErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  if (!isLogin.value) {
    if (!authForm.confirmPassword) {
      authErrors.confirmPassword = 'Confirma tu contraseña'
      isValid = false
    } else if (authForm.password !== authForm.confirmPassword) {
      authErrors.confirmPassword = 'Las contraseñas no coinciden'
      isValid = false
    }
  }

  return isValid
}

const handleAuth = async () => {
  if (!validateAuthForm()) return

  authLoading.value = true
  authErrors.general = ''

  try {
    if (isLogin.value) {
      await authStore.login({
        email: authForm.email,
        password: authForm.password
      })
    } else {
      await authStore.register({
        name: authForm.name,
        email: authForm.email,
        password: authForm.password
      })
    }

    taskStore.loadTasks()
    resetAuthForm()
    await router.push('/dashboard')
  } catch (error) {
    authErrors.general = error.message
  } finally {
    authLoading.value = false
  }
}
</script>
