
// const layoutView = () => import('@/layout/defaultRouter.vue');
//动态加载路由
export const asyncRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: 'dashboard', // 名称
      auth: ['admin', 'user'], // 权限
      icon: 'icon-dashboard',
    },
  },
  // 管理后台 
  {
    path: "/index",
    name: "Index",
    meta: {
      title: "系统管理",
      icon: "icon-setting",
      auth: ['admin', 'user'], // 权限
    },
    component: () => import('@/layout/defaultRouter.vue'),
    children: [{
        path: "/system",
        name: "user",
        meta: {
          title: "用户管理",
          auth: ['admin', 'user'],
        },
        component: () => import("@/views/others.vue"),
      },
      {
        path: "/role",
        name: "role",
        meta: {
          title: "角色管理",
          auth: ['admin', 'user'],
        },
        component: () => import("@/views/system/role.vue")
      }
    ]
  },
  //三级菜单
  {
    path: '/area',
    name: 'area',
    meta: {
      title: '首页',
      icon: 'icon-USB',
      auth: ['admin', 'user'],
    },
    component: () => import('@/layout/defaultRouter.vue'),
    children: [{
      path: "/404",
      name: "404",
      meta: {
        title: "404",
        auth: ['admin', 'user'],
      },
      component: () => import("@/views/errorPages/404.vue"),
      children: [{
          path: "/404-1",
          name: "404-1",
          meta: {
            title: "404子",
            auth: ['admin', 'user'],
          },
          component: () => import("@/views/errorPages/404-1/404-1.vue"),
        },
        {
          path: "/404-2",
          name: "404-2",
          meta: {
            title: "404子2",
            auth: ['admin', 'user'],
          },
          component: () => import("@/views/errorPages/404-1/404-2.vue"),
        },
      ]
    }, {
      path: '/home',
      name: 'home',
      meta: {
        title: "其他",
        icon: 'icon-folder',
        auth: ['admin', 'user'],
      },
      component: () => import('@/views/home.vue'),
    }]
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/errorPages/500.vue'),
    meta: {
      title: '500', // 名称
      auth: ['user'], // 权限
      icon: 'icon-cloud-download',
    },
  },
]