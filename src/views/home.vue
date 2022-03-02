<template>
  <div>
     home
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import HelloWorld from '../components/HelloWorld.vue';

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  setup() {
    const state = reactive({
      count: 0,
    });

    async function mockTest() {
      try {
        const config = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ a: 1,b:2 })
        };
        // 它只是一个 HTTP 响应，而不是真的 JSON。为了获取JSON的内容，我们需要使用 json() 方法（该方法返回一个将响应 body 解析成 JSON 的 promise）
        const response = await fetch('/api/mockText', config).then(res => res.json());
        console.log("response", response)
      } catch (err) {
        console.log("error")
      }
    }

    return {
      ...toRefs(state),
      mockTest,
    }
  },
  mounted: function () {
    console.log(this)
    this.mockTest();
  }
}
</script>

<style lang="less" scoped>
</style>