// import router from "@/router";
import store from '@/store';
import nProgress from '@/utils/progress';
import router, {asyncRoutes } from '@/router';

//路由守卫
router.beforeEach(async (to, from, next) => {
  nProgress.start();
  const token = localStorage.getItem('token');
  const menuList = store.state.auth.menuList;

  if(token){
    if (to.path === '/login') {
      next('/dashboard');//中断当前导航，执行新的导航
    } else {
      //  正常跳转 ，已生成路由
      if (menuList.length) {
        next();
      } else {
        //  生成路由在跳转
        const auth = 'admin'; // 解析token 或者请求后台回去登陆角色(不同于缓存，vuex刷新会初始state，故此处调接口或解析)let { auth } = await store.dispatch('user/GetInfo', token)
        await store.dispatch('auth/routers', auth);
        // 如果 addRoute 并未完成，路由守卫会一层一层的执行执行，直到 addRoute 完成，找到对应的路由()
        // 如果参数to不能找到对应的路由的话，就再执行一次beforeEach((to, from, next)直到其中的next({ ...to})能找到对应的路由为止。
        next({ ...to, replace: true });
      }
    } 
  }else {
    if (to.path !== '/login') {
      next({ path: '/login' });
    } else {
      next();
    }
  }
});

router.afterEach((to, from) => {
  nProgress.done();
});