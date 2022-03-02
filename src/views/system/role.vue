<template>
  <div>
    role
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import a from "./test.js"

export default {
  setup () {
    const state = reactive({
      count: 0,
    })
    console.log(a,'this is import')
  
    return {
      ...toRefs(state),
    }
  }
}
</script>

<style lang="less" scoped>

</style>