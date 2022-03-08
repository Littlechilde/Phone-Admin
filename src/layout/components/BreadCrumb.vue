<template>
  <div class="flex-center">
    <a-breadcrumb :routes="matchedRoute">
      <template #itemRender="{ route, routes }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ route.meta.title }}
        </span>
        <router-link v-else :to="route.path">
          {{ route.meta.title }}
        </router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router';

export default {
  setup(){
  const routeNav = useRoute();
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
  
  return {
      matchedRoute,
      filterHidden
   }
 }
}
</script>
<style lang="less" scoped>
.flex-center {
  background-color: #fff;
  padding:12px 24px;
}
</style>