import { defineStore } from "pinia"
import { useAuthStore } from "./auth.js"

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    nextId: 1,
  }),

  getters: {
    pendingTasks: (state) => state.tasks.filter((task) => task.status === "pending"),
    inProgressTasks: (state) => state.tasks.filter((task) => task.status === "in-progress"),
    completedTasks: (state) => state.tasks.filter((task) => task.status === "completed"),
    urgentTasks: (state) => state.tasks.filter((task) => task.priority === "urgent"),

    tasksByPriority: (state) => {
      return state.tasks.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    },
  },

  actions: {
    addTask(taskData) {
      const authStore = useAuthStore()
      const newTask = {
        ...taskData,
        id: this.nextId++,
        userId: authStore.user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      this.tasks.push(newTask)
      this.saveTasks()
      return newTask
    },

    updateTask(id, updatedData) {
      const index = this.tasks.findIndex((task) => task.id === id)
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          ...updatedData,
          updatedAt: new Date().toISOString(),
        }
        this.saveTasks()
        return this.tasks[index]
      }
      return null
    },

    deleteTask(id) {
      const index = this.tasks.findIndex((task) => task.id === id)
      if (index !== -1) {
        this.tasks.splice(index, 1)
        this.saveTasks()
        return true
      }
      return false
    },

    getTaskById(id) {
      return this.tasks.find((task) => task.id === Number.parseInt(id))
    },

    filterTasks(filters) {
      let filtered = [...this.tasks]

      if (filters.priority) {
        filtered = filtered.filter((task) => task.priority === filters.priority)
      }

      if (filters.status) {
        filtered = filtered.filter((task) => task.status === filters.status)
      }

      if (filters.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter(
          (task) => task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search),
        )
      }

      return filtered.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    },

    saveTasks() {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      if (userId) {
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(this.tasks))
        localStorage.setItem(`nextId_${userId}`, this.nextId.toString())
      }
    },

    loadTasks() {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      if (userId) {
        const savedTasks = localStorage.getItem(`tasks_${userId}`)
        const savedNextId = localStorage.getItem(`nextId_${userId}`)

        if (savedTasks) {
          this.tasks = JSON.parse(savedTasks)
        }

        if (savedNextId) {
          this.nextId = Number.parseInt(savedNextId)
        }
      }
    },

    clearTasks() {
      this.tasks = []
      this.nextId = 1
      this.saveTasks()
    },
  },
})
