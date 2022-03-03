<template>
  <div>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys"  v-model:openKeys="openKeys" theme="dark" mode="inline" @click="selectMenu" @openChange="openChange">
        <template v-for="item in menuList">
            <template v-if="!item.hidden">
                <!-- 无子菜单 -->
                 <a-menu-item v-if="hasOnlyChildren(item)" :key="item.path" @click="clickMenuItem(item.name)">
                     <icon-font :type="item.meta.icon" v-if="item.meta.icon" :style="{fontSize:collapsed ? '18px':'16px'}"/>
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
import { reactive, toRefs,computed } from 'vue';
import { useRouter } from "vue-router";
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
  setup () {
    // 路由
    const {options:{routes}}=useRouter();
    const router = useRouter();
    const store = useStore();
    const menuList = computed(()=> store.state.auth.menuList);
    console.log("router", router)

    // 检测是否只有一个子路由
    const hasOnlyChildren = (res) => {
        // 不存在子级的情况
        if(!res.children) { return true; }
        return false;
    };
    const getMenu =reactive({
       selectedKeys: localStorage.getItem("selectedKeys") ? [localStorage.getItem("selectedKeys")] : [menuList.value[0].path],
       openKeys: localStorage.getItem("openKeys") ? JSON.parse(localStorage.getItem("openKeys")): [],
    });
    //菜单选中事件
    const selectMenu=({item,key,keyPath})=>{
        getMenu.selectedKeys = [key];
        localStorage.setItem("selectedKeys",key);
    };
    const openChange=(openKeys)=>{
      getMenu.openKeys = openKeys;
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
      hasOnlyChildren,
      ...toRefs(getMenu),
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
</style>