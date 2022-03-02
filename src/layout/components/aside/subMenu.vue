<template>
    <a-sub-menu :key="menu.path">
      <template #title>
          <span>
            <icon-font :type="menu.meta.icon" v-if="menu.meta.icon" :style="{fontSize:collapsed ? '18px':'16px'}"/>
            <span>{{ menu.meta && menu.meta.title }}</span>
          </span>
      </template>
      <template v-if="menu.children.length && menu.children">
        <template v-for="item in menu.children">
            <template v-if="!item.hidden">
                <!-- 不存在子级的栏目 -->
                <a-menu-item v-if="!item.children" :key="item.path">
                    <router-link :to="item.path">{{ item.meta && item.meta.title }}</router-link>
                </a-menu-item>
                <!-- 存在子级栏目 -->
                <Menu v-else :menu="item" :key="item.path" />
            </template>
        </template>
      </template>
    </a-sub-menu>
</template>

<script>
import { SettingOutlined } from '@ant-design/icons-vue';
import IconFont from "@/assets/iconFont/icon";
export default {
  name: "Menu",
  components: {SettingOutlined,IconFont},
  props: {
    menu: {
      type: Object,  // array
      default: () => ({})
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {}
  }
}
</script>

<style lang="less" scoped>
</style>