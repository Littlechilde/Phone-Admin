<template>
  <div class="menuSider">
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys"  v-model:openKeys="openKeys" theme="dark" mode="inline" @click="selectMenu" @openChange="openChange">
        <template v-for="item in menuList">
            <template v-if="!item.hidden">
                <!-- 无子菜单 -->
                 <a-menu-item v-if="hasOnlyChildren(item)" :key="item.path" @click="clickMenuItem(item.name)">
                     <icon-font :type="item.meta.icon" v-if="item.meta.icon" :style="{fontSize:collapsed ? '20px':'18px'}"/>
                     <span>{{ item.meta.title }}</span>
                 </a-menu-item>
                 <!-- 有子菜单 -->
                 <Menu v-else :menu="item" :key="item.path" :collapsed="collapsed"/>
            </template>
        </template>
      </a-menu>
  </div>
</template>

<script>
import { reactive, toRefs,computed,watch,ref } from 'vue';
import { useRouter,useRoute } from "vue-router";
import {useStore} from "vuex"
import Menu from "./subMenu.vue";
import { SettingOutlined } from '@ant-design/icons-vue';
import IconFont from "@/assets/iconFont/icon";

export default {
  name:"LayoutAside",
  components:{ Menu,SettingOutlined,IconFont },
  props: {
    collapsed: {
        type: Boolean,
        default: false
    }
  },
  setup (props) {
    // 路由
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const menuList = computed(()=> store.state.auth.menuList);
    const openKeys = computed({
      get() {
        return store.state.user.openKeys
      },
      set(value) {
        store.commit('user/SET_KEYS', value)
      }
    });
    // const getMenu =reactive({
    //    openKeys: localStorage.getItem("openKeys") ? JSON.parse(localStorage.getItem("openKeys")): [],
    // });
    //检测路由变化的菜单选择
    let selectedKeys = ref([]);
    watch(() => route.path,() => {
        selectedKeys.value = [route.path]
      }, { immediate: true,});

    // 检测是否只有一个子路由
    const hasOnlyChildren = (res) => {
        // 不存在子级的情况
        if(!res.children) { return true; }
        return false;
    };
    //菜单选中事件
    const selectMenu=({key})=>{
        console.log(key)
    };
    //菜单折叠事件
    const openChange=(openKeys)=>{
      // getMenu.openKeys = openKeys;
      localStorage.setItem("openKeys", JSON.stringify(openKeys)); // 设置
    }
    //路由跳转
    const clickMenuItem = (name)=>{
      //确认是否存在指定名称的路由
      if(router.hasRoute(name))
      router.push({name})
      else router.push({name: "noPower"})
    };
    return {
      menuList,
      selectedKeys,
      openKeys,
      hasOnlyChildren,
      // ...toRefs(getMenu),
      selectMenu,
      clickMenuItem,
      openChange
    }
  }
}
</script>

<style lang="less" scoped>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}
.menuSider{
  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
  //  width:calc(100% + 6px);
}
</style>