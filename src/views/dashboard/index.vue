<template>
  <div class="index">
    <div style="margin-bottom:30px">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card>
            <a-statistic title="访问量" :value="11234">
              <template #prefix></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic title="Star" :value="100">
              <template #prefix></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic title="卡片三" :value="9.3" suffix="%" :value-style="{ color: '#cf1322' }">
              <template #prefix></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic title="卡片四" :value="9.3" suffix="%" :value-style="{ color: '#cf1322' }">
              <template #prefix></template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <a-card class="introduction">
      <h3>项目简介</h3>
      <p>
        技术栈：vue3 +
        ant-design-vue，使用vue3.2最新的setup语法搭建，并且封装了部分钩子函数，是用来学习vue3的一个良好选择，并且，项目集成了实际开发中常用的功能，可以作为一个参考项目继续开发
      </p>
      <p>
        项目地址：<a style="color: #1890ff" href="https://github.com/BaiFangZi/vue3-antd-manage"
          >github</a
        >
      </p>
      <p>
        项目预览地址 ：<a style="color: #1890ff" href="https://baifangzi.gitee.io/vue3-antd-manage"
          >点击预览</a
        >
      </p>
    </a-card>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import helloWorld from '@/components/HelloWorld.vue'

export default {
  components: { helloWorld },
  setup() {
    const state = reactive({
    })

    return {
      ...toRefs(state),
    }
  }
}
</script>

<style lang="less" scoped>
.introduction {
  margin-bottom: 30px;
}
.index{
  background:transparent !important;
  padding:0 !important;
}
</style>