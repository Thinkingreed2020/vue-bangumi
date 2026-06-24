import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/homePage.vue'),
    },
    {
      path: '/itemDetail/:id',
      name: 'itemDetail',
      component: () => import('@/views/itemDetail.vue'),
    },
    {
      path: '/user/:id',
      name: 'user',
      component: () => import('@/views/userInfo.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/loginPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/notFound.vue'),
    },
  ],
})

export default router
