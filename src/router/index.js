//工厂函数创建router实例
import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/account/login-1.vue'),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export { constantRoutes } from './constantRoutes';
export { asyncRoutes } from './asyncRoutes';
export default router;