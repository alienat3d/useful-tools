import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CompareThatView from '../views/CompareThatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* {
      path: '/',
      name: 'home',
      component: HomeView,
    }, */
    {
      path: '/',
      name: 'compare-that',
      component: CompareThatView,
    },
    /* {
      path: '/compare-that',
      name: 'compare-that',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CompareThatView.vue'),
    }, */
  ],
})

export default router
