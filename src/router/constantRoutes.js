//静态路由
export const constantRoutes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/layout.vue'),
    redirect: '/dashboard',
    meta: {
      title: 'Layout',
    },
    children: [],
  },
  {
    path:'/404NotFound',
    name:'NotFound',
    component:()=>import('@/views/errorPages/404.vue')
  },
  // { path: '/:pathMatch(.*)*', redirect: '/404NotFound' },
]
