<template>
  <div class="flex-center">
    <a-breadcrumb :routes="matchedRoute">
      <template #itemRender="{ route, params, routes, paths }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ route.meta.title }}
        </span>
        <!-- <router-link v-else :to="route.path">{{ route.meta.title }}</router-link> -->
        <a @click="toPath(route,paths)" v-else>{{route.meta.title }}</a>
      </template>
    </a-breadcrumb>
  </div>
</template>
<script>
import { ref, watch,defineComponent } from 'vue' 
import { useRouter,useRoute } from 'vue-router';
import { useStore } from "vuex";

export default  defineComponent({
  props: {
    collapsed: {
        type: Boolean,
        default: false
    }
  },
//  通过第二个参数 解构 emits 接收父组件传递过来的函数
  setup(props, { emit }){
  const routeNav = useRoute();
  const router = useRouter();
  const store = useStore();
  let matchedRoute = ref([]);
  watch(
    () => routeNav.matched,
    () => {
      matchedRoute.value = filterHidden(routeNav.matched)
    },
    {
      immediate: true,
    }
  );
  //递归查找hidden项
  function filterHidden (routeNav){
    const result= routeNav.filter((item)=>{
      if(item.children){
        item.children = filterHidden(item.children);
      }
      return !item.hidden
    })
    return result
  }
  //点击折叠事件
  function filterSon(route,paths){
     if(route.children && paths.length > 0){
      let keys = JSON.parse(localStorage.getItem("openKeys"));
      if(!keys.includes(route.path)){
        keys.push(route.path);
        /*三级菜单：枚举*/
        /*for(let i in route.children){
          if(route.children[i].children){
            if(route.children[i].path==route.redirect){
              keys.push(route.redirect);
              break;
            }
          }
        }*/
        /**递归 ,无限层*/
        for(const i in route.children){
          if(route.children[i].children){
            keys.push(route.redirect);
            const array=filterChild(route.children);
            /**转化为一维数组 */
            const arrayKeys= flatten(array).filter(i=>i !=undefined);
            console.log(arrayKeys);
            arrayKeys.pop();
            keys=distinct(keys.concat(arrayKeys),[]);
            break;
          }
        }
        if(!props.collapsed)
        store.commit('user/SET_KEYS', keys);
        localStorage.setItem("openKeys",JSON.stringify(keys));
      }
    }
  };
 const flatten=(arr)=> { return [].concat( ...arr.map(x => Array.isArray(x) ? flatten(x) : x) ) };
//  ES6 新增了 Set 这一数据结构，类似于数组，但 Set 的成员具有唯一性基于这一特性，就非常适合用来做数组去重了
 const distinct = (a, b)=> {
    return Array.from(new Set([...a, ...b]))
 }
 /**递归redirect */
 function filterChild(route){
   const result =[];
   for(const i in route){
    result.push(route[i].redirect);
    if(route[i].children){
      const child = filterChild(route[i].children)
      result.push(child);
    }
   }
   return result
 }
  //跳转
  function toPath(route,paths){
    console.log(route)
    router.push(route.path);
    filterSon(route,paths);
  }
  
  return {
      matchedRoute,
      filterHidden,
      toPath
   }
 }
})
</script>
<style lang="less" scoped>
.flex-center {
  background-color: #fff;
  padding:12px 24px;
}
</style>