<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { createPinia } from 'pinia'

// Crear instancia de Pinia
const pinia = createPinia()

// Store de autenticación
const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  
  actions: {
    async login(credentials) {
      try {
        // Simular llamada a API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Error al iniciar sesión')
        }
        
        const data = await response.json()
        
        this.user = data.user
        this.token = data.token
        this.isAuthenticated = true
        
        // Guardar en localStorage
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        
        return data
      } catch (error) {
        throw error
      }
    },
    
    async register(userData) {
      try {
        // Simular llamada a API
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Error al crear la cuenta')
        }
        
        const data = await response.json()
        
        this.user = data.user
        this.token = data.token
        this.isAuthenticated = true
        
        // Guardar en localStorage
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        
        return data
      } catch (error) {
        throw error
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // Limpiar localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('tasks')
      localStorage.removeItem('nextId')
    },
    
    checkAuth() {
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('auth_user')
      
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    }
  }
})

// Store de tareas (actualizado para incluir usuario)
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
        userId: useAuthStore().user?.id,
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
      const userId = useAuthStore().user?.id
      if (userId) {
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(this.tasks))
        localStorage.setItem(`nextId_${userId}`, this.nextId.toString())
      }
    },
    
    loadTasks() {
      const userId = useAuthStore().user?.id
      if (userId) {
        const savedTasks = localStorage.getItem(`tasks_${userId}`)
        const savedNextId = localStorage.getItem(`nextId_${userId}`)
        
        if (savedTasks) {
          this.tasks = JSON.parse(savedTasks)
        }
        
        if (savedNextId) {
          this.nextId = parseInt(savedNextId)
        }
      }
    },
    
    clearTasks() {
      this.tasks = []
      this.nextId = 1
    }
  }
})

const authStore = useAuthStore(pinia)
const taskStore = useTaskStore(pinia)
const router = useRouter()

onMounted(() => {
  authStore.checkAuth()
  if (authStore.isAuthenticated) {
    taskStore.loadTasks()
    router.push('/tasks')
  } else {
    router.push('/login')
  }
})
</script>
