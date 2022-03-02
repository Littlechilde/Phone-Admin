<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from '@/components/HelloWorld.vue'
import { useStore } from "vuex";
import { computed } from 'vue';
export default {
  components:{HelloWorld},
  setup(){
   const store = useStore();
   console.log(store,123)
   const test =computed(()=>store.state.auth.test)
   return {
     test
   }
  }
}
</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
   <!-- <div>{{$store.state.test}}</div>
   <div><span>{{test}}</span></div> -->
   <router-view/>
</template>

<style lang="less">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   /* margin-top: 60px; */
// }
// div{
//   span{
//     color:gold;
//   }
// }
</style>
