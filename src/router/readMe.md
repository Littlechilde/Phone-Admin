{
  "path": "/a/b", //访问url，必填项
  "name": "welcome", // 路由名称，必填项
  "component": "view/sdfsdf/abc", //组件位置，必填项
  "redirect": "/ab", //是否跳转，可选项
  "meta": {
    "title": "测试组件", //页面标题，必填项
    "sort":0，//排序，必填项
    "description":"说明",//说明，可选项
    "icon": "sskdf", //菜单图标，可选项
    "affix": true, //当前路由是否固定多标签页，（默认值：true），必填项
    "hidden": false, //是否显示在菜单中显示路由（默认值：false），必填项
    "target": "target", //是否连接跳转，可选项
    "alwaysShow": false, //当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false），必填项
    "tagHidden": false, // 当前路由是否不显示多标签页（默认值：false），可选项
    "ability": ["add", "delete", "edit"] //["add","delete","edit","search","export","import","upload",audit,"custom"]，按钮权限值，必填项
  },
  "children": [] //是否有子节点[],可选项
}

/*动态路由 前端控制,name匹配*/
const menuList=[{name:'测试3'},{name:'测试38'},{name:'测试380'}]
const asyncRouterMap=[{name:'测试1'},{name:'测试2'},{name:'测试3',children:[{name:'测试4'},{name:'测试5'}]}]

function hasPermission (route) {
  if (menuList.length) {
    let flag = false;
    for(let i=0;i <menuList.length;i++) {
      flag= menuList[i].name ==route.name;
      if(flag) {
        return true
      }
    }
    return false
  }
  return true
}
function filterAsyncRouter (routerMap) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
    return false
  })
  return accessedRouters
}
const accessedRouters = filterAsyncRouter(asyncRouterMap)
