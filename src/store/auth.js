import router, { constantRoutes, asyncRoutes } from '../router';
import {navMenu} from '@/api/role';
// 该 Glob 模式会被当成导入标识符：必须是相对路径（以 ./ 开头）或绝对路径（以 / 开头，相对于项目根目录解析）。
const modules = import.meta.glob('/src/**/*.vue');

//初始化数据
const state = {
  auth:'admin',
  menuList: [],
};
//响应组件中操作
const actions = {
 async routers({ commit }, auth){
    /**加载角色菜单(后台) ，初始标识前端设置，其中数据勾选权限标识后台修改权限标识[user,admin,test](猜测方法1)--->traversalRoutes()*/
    const {data}= await navMenu();
    const asyncRoutesApi = roleMenu(data);
    console.log(asyncRoutesApi);
    return new Promise((resolve, reject) => {
      const layout = constantRoutes.find((item) => item.path === '/');
      //角色筛选
      /*const authRoutes = traversalRoutes(asyncRoutes, auth);*/
      const authRoutes = traversalRoutes(asyncRoutesApi, auth);
      layout.children = [...authRoutes];
      constantRoutes.forEach((r) => router.addRoute(r));
      commit('GENERATE_ROUTES', asyncRoutesApi);
      resolve();
    })
  }
};
//执行action中的操作,或组件直接操作——用于操作数据（state）
const mutations = {
  async GENERATE_ROUTES(state, authRoutes) {
    state.menuList = authRoutes;
    // state.auth = auth;
  },
  /**面包屑、记住aside栏点击事件 key，跟随menulist*/
  /*async ASIDE_KEY(state,key){
    state.selectedKeys=[key];
    localStorage.setItem("selectedKeys",key);
  }*/
}
//当state中的数据需要经过加工后再使用时，可以使用getters加工
const getters = {
  token:(state)=>state.auth
}
//递归筛选角色菜单
function traversalRoutes(routes, auth) {
  const result = []
  routes.forEach((r) => {
    let { meta, children } = r
    if (meta.auth.includes(auth)) {
      if (children && children.length) {
        r.children = traversalRoutes(children, auth)
      }
      result.push(r)
    }
  })
  return result
};
//用户加载菜单格式化,require 是属于 Webpack 的方法
function roleMenu(menu) {
  let result =[];
  menu.map(item => {
    let menuObj={};
    menuObj.path=item.url;
    menuObj.name=item.routerName;
    menuObj.component =modules[`${item.component}`];
    menuObj.meta={
      icon:item.icon,
      auth:item.perms ? item.perms.split(','):'',
      title:item.name
    }
    if(item.redirect){
      menuObj.redirect=item.redirect;
    }
    if(item.hidden){
      menuObj.hidden=item.hidden;
    }
    if(item.list && item.list.length){
      menuObj.children = roleMenu(item.list);
    }
    result.push(menuObj);
  })
  return result;
}

export default {
  namespaced: true, //开启命名空间
  state,
  getters,
  mutations,
  actions,
}

