import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const DEFAULT_TITLE = 'Useful Tools'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/compare-that',
      name: 'compare-that',
      meta: { title: 'Compare That' },
      component: () => import('../views/CompareThatView.vue'),
    },
    {
      path: '/dates-reminder',
      name: 'dates-reminder',
      meta: { title: 'Dates Reminder' },
      component: () => import('../views/DatesReminderView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta?.title ? to.meta.title : DEFAULT_TITLE

  next()
})

export default router
