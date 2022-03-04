import router, { constantRoutes, asyncRoutes } from '../router';

//初始化数据
const state = {
  auth: localStorage.getItem('token') || '',
  menuList: [],
  // selectedKeys:[localStorage.getItem('selectedKeys')]
};
//响应组件中操作
const actions = {};
//执行action中的操作,或组件直接操作——用于操作数据（state）
const mutations = {
  async GENERATE_ROUTES(state, auth) {
    const layout = constantRoutes.find((item) => item.path === '/');
    //角色筛选
    const authRoutes = traversalRoutes(asyncRoutes, auth);
    layout.children = [...authRoutes];
    state.menuList = authRoutes;
    state.auth = auth;
    constantRoutes.forEach((r) => router.addRoute(r));
    console.log(constantRoutes,'router')
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

export default {
  namespaced: true, //开启命名空间
  state,
  getters,
  mutations,
  actions,
}

