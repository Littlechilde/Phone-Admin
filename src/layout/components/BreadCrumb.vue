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
<script setup>
import { ref, watch } from 'vue'
import { useRoute,useRouter } from 'vue-router';

const routeNav = useRoute();
const router = useRouter();

let matchedRoute = ref([])
watch(
  () => routeNav.matched,
  () => {
    matchedRoute.value = routeNav.matched.slice(0)
  },
  {
    immediate: true,
  }
)
</script>
<style lang="less" scoped>
.flex-center {
  background-color: #fff;
  padding:12px 24px;
}
</style>