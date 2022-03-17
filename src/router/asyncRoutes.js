
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
    redirect:'/404',
    component: () => import('@/layout/defaultRouter.vue'),
    children: [{
      path: "/404",
      name: "404",
      meta: {
        title: "404",
        auth: ['admin', 'user'],
      },
      redirect:'/404-2',
      component: () => import("@/views/errorPages/404.vue"),
      children: [{
          path: "/404-1",
          name: "404-1",
          meta: {
            title: "404子",
            auth: ['admin','user'],
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
  /*系统管理*/
  {
    path: '/systemManage',
    name: 'systemManage',
    hidden:false,
    component: () => import('@/layout/defaultRouter.vue'),
    meta: {
      title: '系统管理', // 名称
      auth: ['admin','user'], // 权限
      icon: 'icon-setting',
    },
    redirect:'/userAdmin',
    children: [{
      path: "/userAdmin",
      name: "userAdmin",
      meta: {
        title: "用户管理",
        auth: ['admin', 'user'],
      },
      component: () => import("@/views/systemManage/user.vue"),
    },
    {
      path: "/userRole",
      name: "userRole",
      meta: {
        title: "角色管理",
        auth: ['admin', 'user'],
      },
      component: () => import("@/views/systemManage/role.vue"),
    }
  ]
  },
  /**地区管理 */
  {
    path: '/areaManage',
    name: 'areaManage',
    component: () => import('@/views/areaManage/area.vue'),
    meta: {
      title: '地区管理', // 名称
      auth: ['admin', 'user'], // 权限
      icon: 'icon-location',
    },
  },
  {
    path: '/phoneType',
    name: 'phoneType',
    component: () => import('@/views/phoneOrderType/type.vue'),
    meta: {
      title: '话单类型管理', // 名称
      auth: ['admin','user'], // 权限
      icon: 'icon-file-text',
    },
  },
   /**号段管理 */
   {
    path: '/scopeManage',
    name: 'scopeManage',
    component: () => import('@/views/scopeManage/scope.vue'),
    meta: {
      title: '号段管理', // 名称
      auth: ['admin', 'user'], // 权限
      icon: 'icon-column-width',
    },
  },
    /**客户管理 */
    {
      path: '/userManage',
      name: 'userManage',
      hidden:false,
      component: () => import('@/layout/defaultRouter.vue'),
      meta: {
        title: '客户管理', // 名称
        auth: ['admin','user'], // 权限
        icon: 'icon-user',
      },
      redirect:'/userList',
      children: [{
        path: "/userList",
        name: "userList",
        meta: {
          title: "客户列表",
          auth: ['admin', 'user'],
        },
        component: () => import("@/views/userManage/userList.vue"),
      },
      {
        path: "/paySetting",
        name: "paySetting",
        meta: {
          title: "话费设置",
          auth: ['admin', 'user'],
        },
        component: () => import("@/views/userManage/callCharges.vue"),
      }
    ]
    },
  /**话单管理 */
  {
    path: "/billSetting",
    name: "billSetting",
    redirect: {path:'/billDetails'},
    meta: {
      title: "话单管理",
      icon: "icon-mobile",
      auth: ['admin', 'user'], // 权限
    },
    component: () => import('@/layout/defaultRouter.vue'),
    children: [{
        path: "/billDetails",
        name: "billDetails",
        meta: {
          title: "明细话单",
          auth: ['admin', 'user'],
        },
        component: () => import("@/views/billManage/billDetails.vue"),
      },
      {
        path: "/errorBill",
        name: "errorBill",
        meta: {
          title: "异常话单",
          auth: ['admin', 'user'],
        },
        component: () => import("@/views/billManage/errorBill.vue"),
      },
      // {
      //   path: "/numberManage",
      //   name: "numberManage",
      //   meta: {
      //     title: "号码资源管理",
      //     auth: ['admin', 'user'],
      //   },
      //   component: () => import("@/views/billManage/numberManage.vue"),
      // }
    ]
  },
    /**统计报表 */
    {
      path: '/total',
      name: 'total',
      component: () => import('@/views/statistics/form.vue'),
      meta: {
        title: '统计报表', // 名称
        auth: ['admin', 'user'], // 权限
        icon: 'icon-piechart',
      },
    },
    /**系统规则  */
    // {
    //   path: '/systemRule',
    //   name: 'systemRule',
    //   component: () => import('@/views/systemRule/rule.vue'),
    //   meta: {
    //     title: '系统规则', // 名称
    //     auth: ['admin', 'user'], // 权限
    //     icon: 'icon-wrench',
    //   },
    // },
    /**设备台账 */
    {
      path: '/equipmentLedger',
      name: 'equipmentLedger',
      component: () => import('@/views/equipmentLedger/ledger.vue'),
      meta: {
        title: '设备台账', // 名称
        auth: ['admin', 'user'], // 权限
        icon: 'icon-phone',
      },
    },
    /*话机信息*/
    {
      path: '/infoManage',
      name: 'infoManage',
      component: () => import('@/views/infoManage/mobile.vue'),
      meta: {
        title: '话机信息管理', // 名称
        auth: ['admin', 'user'], // 权限
        icon: 'icon-mail',
      },
    },
    /*活跃度统计*/
    {
      path: '/activity',
      name: 'activity',
      component: () => import('@/views/activity/statistical.vue'),
      meta: {
        title: '活跃度统计', // 名称
        auth: ['admin', 'user'], // 权限
        icon: 'icon-barchart',
      },
    },
  /**错误页 */
  {
    path: '/403',
    name: 'errorTags',
    hidden:true,
    redirect:'/403noPower',
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