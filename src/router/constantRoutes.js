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
  //由于路由是从上到下执行的，只要在路由配置中最后面放个*号就可以了，例如：
  {
    path:'/404NotFound',
    name:'NotFound',
    component:()=>import('@/views/errorPages/404notfound.vue')
  },
  { path: '/:pathMatch(.*)*', redirect: '/404NotFound' },
]
