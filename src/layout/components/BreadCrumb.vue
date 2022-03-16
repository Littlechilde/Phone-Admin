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
      const keys = JSON.parse(localStorage.getItem("openKeys"));
      if(!keys.includes(route.path)){
        keys.push(route.path);
        for(let i in route.children){
          if(route.children[i].children){
            if(route.children[i].path==route.redirect)
            keys.push(route.redirect);
            break;
          }
        }
        if(!props.collapsed)
        store.commit('user/SET_KEYS', keys);
        localStorage.setItem("openKeys",JSON.stringify(keys));
      }
    }
  }
  //跳转
  function toPath(route,paths){
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