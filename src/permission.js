import router from "@/router";
import store from '@/store';
import nProgress from '@/utils/progress';

//路由守卫
router.beforeEach(async (to, from, next) => {
  nProgress.start();
  const token = localStorage.getItem('token');
  const menuList = store.state.auth.menuList;

  if (to.path === '/login') {
    // if (!token) next();
    // else next('/dashboard')
    next()
  } else if (token) {
    //  正常跳转 ，已生成路由
    if (menuList.length) {
      next();
    } else {
      //  生成路由在跳转
      const auth = token; // 解析token 或者请求后台回去登陆角色
      store.commit('auth/GENERATE_ROUTES', auth);
      next({
        path: to.path,
        replace: true,
      })
    }
  } else {
    next('/login');
  }
});

router.afterEach((to, from) => {
  nProgress.done();
});