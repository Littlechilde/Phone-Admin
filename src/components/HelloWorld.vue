<template>
  <div>
   组件{{count}} +++ {{count1}} ++
   <a @click="fan">fan</a>

   <a @click="fan3">fan3 + {{a}}</a>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  setup () {
    let state = reactive({
      count: 0,
      a:{
       b:1 
      }
    })
     let   state1 = reactive({
      count1: 1,
    }) 
  const fan=()=>{
    // state1 = reactive({
    //   count1: 122,
    // }) //直接修改、定义、添加属性丧失响应式 或proxy 不触发页面更新
     state.a={d:66}
    //  state1.dh = [172]
     console.log(state1)
  }
  const fan3=()=>{
    state.count = 4 //类似于const的修改
    state.a={}
  }
    return {
      ...toRefs(state),
      ...toRefs(state1),
      fan,
      fan3
    }
  }
}
</script>

<style lang="less" scoped>

</style>