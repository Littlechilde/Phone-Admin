<template>
  <div v-buttonPromise="'import'">
   组件{{count}} +++ {{count1}} ++
   <a @click="fan">fan</a>

   <a @click="fan3">fan3 + {{a}} {{shy}}</a>
  </div>
  <div>
    <a-button type="primary" @click="toTest">测试</a-button>
    <slot name="title"></slot>
  </div>
</template>

<script>
import { reactive, toRefs,toRaw,ref} from 'vue'

export default {
  props: ['msg','show'],
  emits:['update:msg','update:show'],
  setup (props,{emit}) {
    let state = reactive({
      count: 0,
      shy:[{a:1},{a:2}],
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
    // state1=Object.assign(...state1,{count1:999})
     state.a={d:66}
    //  state1.dh = [172]
     console.log(state1)
  }
  const fan3=()=>{
    state.count = 4 //类似于const的修改
    // let {shy} = state
    const d = toRaw(state.shy)
    state.shy= d.filter(item=>item.a !=2)
    console.log(state.shy,d)
    state.a={}
  }
  const toTest=()=>{
    console.log(props)
    emit('update:msg','测试成功')
    emit('update:show','show 成功')
  }
    return {
      ...toRefs(state),
      ...toRefs(state1),
      fan,
      fan3,
      toTest
    }
  }
}
</script>

<style lang="less" scoped>

</style>