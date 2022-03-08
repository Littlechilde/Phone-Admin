<template>
  <a-layout style="min-height:100vh">
      <!-- 左侧菜单 -->
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible class="scrollbar hidden" :style="{ overflowY: 'overlay', height: '100vh'}">
        <LayoutAside :collapsed="collapsed" />
      </a-layout-sider>

      <a-layout>
        <!-- header -->
        <a-layout-header class="headerStyle">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          <a-dropdown class="down">
            <span class="user">
              <a-avatar>
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <a class="ant-dropdown-link" @click.prevent>
                Admin
                <DownOutlined />
              </a>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                <setting-outlined />
                  用户设置
                </a-menu-item>
                <a-menu-item>
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-layout-header>

         <BreadCrumb />
        <!-- content -->
        <a-layout-content :style="{ height:'auto' }">
             <router-view :style="{ background: '#fff',margin: '24px 16px', padding: '24px'}"/>
        </a-layout-content>
      </a-layout>
  </a-layout>
</template>

<script>
import { UserOutlined, VideoCameraOutlined, UploadOutlined, MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, DownOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons-vue';

import { defineComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';//引入路由
import LayoutAside from "@/layout/components/aside/aside.vue";
import BreadCrumb from './components/BreadCrumb.vue'

export default defineComponent({
  name: 'Layout',
  components: {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    HomeOutlined,
    LogoutOutlined,
    SettingOutlined,
    DownOutlined,
    LayoutAside,
    BreadCrumb
  },
  setup() {
    return {
      collapsed: ref(false),
    };
  },
});
</script>
<style lang="less">
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
.trigger:hover {
  color: #1890ff;
  background: rgba(0, 0, 0, 0.025);
}
.site-layout .site-layout-background {
  background: #fff;
}
.headerStyle {
  background: #fff;
  padding: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  padding-right: 16px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  z-index:100;
}
.down {
  justify-self: end;
  align-self: center;
  padding: 0 16px;
  .ant-dropdown-link {
    margin-left: 6px;
  }
}
.user {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s;
}
.user:hover {
  background: rgba(0, 0, 0, 0.025);
}
.ant-layout-content{
  flex:none;
}
.scrollbar {
  overflow-y: overlay;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(144, 147, 153, 0.5);
    border-radius: 2px;
    box-shadow: inset 0 0 6px rgb(0 0 0 / 20%);
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05);
  }
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    z-index: 101;
}
.hidden{
  overflow-y: hidden !important;
}
.hidden:hover{
  overflow-y: overlay !important;
}
</style>