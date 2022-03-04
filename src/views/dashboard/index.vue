<template>
  <div>
    首页
    <helloWorld :fan='fan'/>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import helloWorld from '@/components/HelloWorld.vue'

export default {
  components: {helloWorld},
  setup () {
    const state = reactive({
      count: 0,
      fan:'fan shy to be 1'
    })
  
    return {
      ...toRefs(state),
    }
  }
}
</script>

<style lang="less" scoped>

</style>