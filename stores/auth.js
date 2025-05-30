import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  actions: {
    async login(credentials) {
      try {
        // Simulación de API - reemplazar con tu backend real
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simular respuesta exitosa
        const userData = {
          id: 1,
          name: credentials.name || "Usuario Demo",
          email: credentials.email,
        }

        const token = "demo-jwt-token-" + Date.now()

        this.user = userData
        this.token = token
        this.isAuthenticated = true

        // Guardar en localStorage
        localStorage.setItem("auth_token", token)
        localStorage.setItem("auth_user", JSON.stringify(userData))

        return { user: userData, token }
      } catch (error) {
        throw new Error("Error al iniciar sesión")
      }
    },

    async register(userData) {
      try {
        // Simulación de API - reemplazar con tu backend real
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const user = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
        }

        const token = "demo-jwt-token-" + Date.now()

        this.user = user
        this.token = token
        this.isAuthenticated = true

        // Guardar en localStorage
        localStorage.setItem("auth_token", token)
        localStorage.setItem("auth_user", JSON.stringify(user))

        return { user, token }
      } catch (error) {
        throw new Error("Error al crear la cuenta")
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      // Limpiar localStorage
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
    },

    checkAuth() {
      const token = localStorage.getItem("auth_token")
      const user = localStorage.getItem("auth_user")

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    },
  },
})
