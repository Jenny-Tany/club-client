import { createRouter, createWebHistory } from 'vue-router'
import ClubManagement from '../views/ClubManagement.vue'
import ActivityManagement from '../views/ActivityManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/clubs'
  },
  {
    path: '/clubs',
    name: 'ClubManagement',
    component: ClubManagement
  },
  {
    path: '/activities',
    name: 'ActivityManagement',
    component: ActivityManagement
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router