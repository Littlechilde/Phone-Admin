
//动态加载路由
export const asyncRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '首页', // 名称
      auth: ['admin', 'user'], // 权限
      icon: 'icon-dashboard',
    },
  },
  // 管理后台 
  {
    path: "/orderIndex",
    name: "orderIndex",
    redirect: {path:'/system'},
    meta: {
      title: "话单管理",
      icon: "icon-mobile",
      auth: ['admin', 'user'], // 权限
    },
    component: () => import('@/layout/defaultRouter.vue'),
    children: [{
        path: "/system",
        name: "user",
        meta: {
          title: "明细话单",
          auth: ['admin', 'user'],
        },
        component: () => import("@/views/system/role.vue"),
      },
      {
        path: "/home",
        name: "role",
        meta: {
          title: "号码资源管理",
          auth: ['admin', 'user'],
        },
        component: () => import("@/views/others.vue"),
      }
    ]
  },
  //三级菜单测试
  {
    path: '/area',
    name: 'area',
    hidden: false,
    meta: {
      title: '三级菜单测试页',
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
            auth: ['user'],
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
    }]
  },
  {
    path: '/phoneType',
    name: 'orderType',
    component: () => import('@/views/phoneOrderType/type.vue'),
    meta: {
      title: '话单类型管理', // 名称
      auth: ['admin','user'], // 权限
      icon: 'icon-file-text',
    },
  },
  /**错误页 */
  {
    path: '/403',
    name: 'errorTags',
    hidden:false,
    component: () => import('@/layout/defaultRouter.vue'),
    meta: {
      title: '错误页', // 名称
      auth: ['admin','user'], // 权限
      icon: 'icon-disconnect',
    },
    children: [{
      path: "/403noPower",
      name: "noPower",
      meta: {
        title: "403",
        auth: ['admin', 'user'],
      },
      component: () => import("@/views/errorPages/403.vue"),
    },
    {
      path: "/500noServe",
      name: "noServe",
      meta: {
        title: "500",
        auth: ['admin', 'user'],
      },
      component: () => import("@/views/errorPages/500noServe.vue"),
    }
  ]
  },
]