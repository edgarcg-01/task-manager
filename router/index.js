import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/auth.js"

// Importar componentes
import LoginView from "../views/LoginView.vue"
import DashboardView from "../views/DashboardView.vue"
import TaskListView from "../views/TaskListView.vue"
import TaskFormView from "../views/TaskFormView.vue"
import AppLayout from "../components/AppLayout.vue"

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: DashboardView,
      },
      {
        path: "tasks",
        name: "TaskList",
        component: TaskListView,
      },
      {
        path: "tasks/new",
        name: "TaskCreate",
        component: TaskFormView,
      },
      {
        path: "tasks/:id/edit",
        name: "TaskEdit",
        component: TaskFormView,
        props: true,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guards de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Verificar autenticación
  authStore.checkAuth()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login")
  } else if (requiresGuest && authStore.isAuthenticated) {
    next("/dashboard")
  } else {
    next()
  }
})

export default router
