  import {keys} from './commonKeys'
  const myDirective =(app) => {
  // 注册
  app.directive('buttonPromise', {
    // 指令具有一组生命周期钩子：
    // 在绑定元素的 attribute 或事件监听器被应用之前调用
    created() {},
    // 在绑定元素的父组件挂载之前调用
    beforeMount() {},
    // 在绑定元素的父组件挂载之后调用
    mounted(el,binding,vnode,prevNode) {
      console.log(el,binding)
      const {value} = binding;
      //  code.includes(keys[value])
      if(keys[value]=='importAuth') 
      el.parentNode.removeChild(el)
    },
    // 在包含组件的 VNode 更新之前调用
    beforeUpdate() {},
    // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
    updated() {},
    // 在绑定元素的父组件卸载之前调用
    beforeUnmount() {},
    // 在绑定元素的父组件卸载之后调用
    unmounted() {}
  })
}
export default myDirective
