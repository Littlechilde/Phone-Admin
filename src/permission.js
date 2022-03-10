// import router from "@/router";
import store from '@/store';
import nProgress from '@/utils/progress';
import router, {asyncRoutes } from '@/router';

//路由守卫
router.beforeEach(async (to, from, next) => {
  nProgress.start();
  const token = localStorage.getItem('token');
  const menuList = store.state.auth.menuList;

  if (to.path === '/login') {
    if (!token) next();
    else next('/dashboard')
  } else if (token) {
    //  正常跳转 ，已生成路由
    if (menuList.length) {
      next();
    } else {
      //  生成路由在跳转
      const auth = 'admin'; // 解析token 或者请求后台回去登陆角色(不同于缓存，vuex刷新会初始state，故此处调接口或解析)let { auth } = await store.dispatch('user/GetInfo', token)
      await store.dispatch('auth/routers', auth);
      // 如果 addRoute 并未完成，路由守卫会一层一层的执行执行，直到 addRoute 完成，找到对应的路由
      next({ ...to, replace: true })
    }
  } else {
    next('/login');
  }
});

router.afterEach((to, from) => {
  nProgress.done();
});