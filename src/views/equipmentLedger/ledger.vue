<template>
  <a-tree-select
    v-model:value="value"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="Please select"
    allow-clear
    tree-default-expand-all
    :tree-data="treeData"
    :field-names="{
      children: 'children',
      label: 'title',
      key: 'key',
      value: 'val',
    }"
  >
    <template #title="{ val:value, title }">
      <b v-if="value=== 'parent 1-1'" style="color: #08c">sss</b>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree-select>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  setup() {
    const value = ref();
    const treeData = ref([{
      title: 'parent 1',
      val: 'parent 1',
      children: [{
        title: 'parent 1-0',
        val: 'parent 1-0',
        children: [{
          title: 'my leaf',
          val: 'leaf1',
        }, {
          title: 'your leaf',
          val: 'leaf2',
        }],
      }, {
        title: 'parent 1-1',
        val: 'parent 1-1',
      }],
    }]);
    watch(value, () => {
      console.log(value.value);
    });
    return {
      value,
      treeData,
    };
  },

});
</script>