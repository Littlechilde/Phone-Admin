<template>
  <div>
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
  </div>
</template>

<script>
import { UserOutlined, VideoCameraOutlined, UploadOutlined, MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, DownOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
export default {
  name:'LayoutHeader',
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
  },
  setup() {
    return {
      collapsed: ref(false),
    }
  }
}
</script>

<style lang="less" scoped>
</style>