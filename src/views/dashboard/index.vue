<template>
  <div class="home">
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
    <a-space :size="16" align="center">
      <HelloWorld ref="sonRef" v-model:msg="message" v-model:show="showModel" >
        <template #title>
          <span>this is a slot</span>
        </template>
      </HelloWorld>
      <a-button @click="getSonComponent">GetSonComponent</a-button>
    </a-space>
     <a-card class="introduction" v-for="(item,index) in [1,2,3,4,5]" :key="index">
      <h3>项目简介{{message}} {{showModel}}</h3>
      <p>
        <text>
       基于原本话单数据，通过数据接口从话务系统定时或者实时获取话单文件，实现系统自动提取话单文件内容，达到自动分析话单数据的目的。
       完成各项数据统计分析。
      系统具有大数据量查询速度快，大数据量存储安全，解析全面，实时性好的特点。
        </text>
      </p>
      <em>设备台账
        管理用户使用到的硬件设备基本信息、安装信息、用户对应的端口和槽位。
        新增：点击“新增”，在弹出的窗口中输入设备基本信息，关联用户，关联槽位和端口，点击保存提交。
        删除：在列表中选中需要删除的号段信息，按“删除”按钮直接删除。
        修改：勾选要修改的设备信息，在弹窗中修改对应的内容，点击保存即可。
        导出：支持查询结果导出excel表格。
      </em>
      <p>
        项目背景：<a style="color: #1890ff" href="javascript:;">点击预览</a>
      </p>
    </a-card>
  </div>
</template>
 
<script>
import { defineComponent, ref } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
 
export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld
  },
  setup(){
    const sonRef = ref(null) // 通过 ref 绑定子组件
    const message = ref('v-model');
    const showModel =ref('组件')
    function getSonComponent () { // 通过 ref 获取子组件\
      // 获取子组件的数据
      console.log(sonRef.value.a)
      sonRef.value.a = {b:2}
    }
    return {
      sonRef,
      message,
      showModel,
      getSonComponent
    }
  }
})
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