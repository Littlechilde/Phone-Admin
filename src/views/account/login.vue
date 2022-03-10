<!--  -->
<template>
  <div class="login-container">
  <a-row style="width: 100%">
      <a-col :span="18"></a-col>
      <a-col :span="6">
        <div class="login-container-form">
          <header>
            <!-- <img src="@/assets/images/logo.png" /> -->
            <h1>话单登录系统</h1>
          </header>
          <a-form :model="form"  ref="formRef">
            <a-form-item name="username"  :rules="[{ required: true, message: '请输入用户名' }]">
              <a-input v-model:value="form.username" size="large"  placeholder="请输入用户名">
                <template v-slot:prefix>
                  <user-outlined type="user" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
              <a-input-password v-model:value="form.password" size="large" type="password" placeholder="请输入密码">
                <template v-slot:prefix>
                  <lock-outlined type="user" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item name="captcha"  :rules="[{ required: true, message: '请输入验证码' }]" class="codeFlex">
              <a-input v-model:value="form.captcha" size="large" placeholder="请输入验证码"></a-input>
              <aside style="width:200px;margin-left: 20px;cursor:pointer" @click="code">
                <img :src="codeSrc" style="width:100%;"  mode="widthFixed"/>
              </aside>
            </a-form-item>
          </a-form>
              <a-button type="primary"  @click="handleSubmit" block :loading="loading">登录</a-button>
              <a-button  @click="handleReset" style="margin-top:16px;margin-bottom: 24px;width: 100%;">重置</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { UserOutlined, LockOutlined  } from "@ant-design/icons-vue";
import { defineComponent, reactive, toRefs,onMounted,ref, nextTick } from "vue";
import { message,notification } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {getCode,Login} from "@/api/api";
import {userInfo} from "@/api/user";
import {timeFix} from "@/utils/time"

export default defineComponent({
  name: "Login",
  components: {
    UserOutlined,
    LockOutlined,
  },

  setup() {
   const state = reactive({
      form: {
        username: '',
        password: '',
        captcha:'',
        captchaToken:''
      },
      codeSrc:'',
      loading:false
    });
    const formRef = ref();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    //mock插件本地测试
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
    //点击登录
    const handleSubmit = async () => {
      await formRef.value.validateFields();
      state.loading=true;
      const {code,data} = await Login(state.form);
        if (!code) {
          localStorage.setItem('token', data);
          /*解析token*/
          const array= data.split('.');
          const str= array[1];
          const {username,userId}=JSON.parse(decodeURIComponent(escape(window.atob(str))));
          const toPath = decodeURIComponent(route.query?.redirect || "/"); //获取登录成功后要跳转的路由。
          const auth = username;
          /* 获取用户信息、身份 */
          // await userInfo({userId:userId})
          message.success("登录成功！");
          openNotificationWithIcon('success');
          await store.dispatch("user/GetInfo", userId);
          await store.dispatch('auth/routers', auth);
          router.replace(toPath).then(() => {
            if (route.name == "login") {
              router.replace("/dashboard");
            }
          });
        } else {
          console.error('error')
        }
       state.loading=false;
    };
    const handleReset=() =>{
       formRef.value.resetFields();
    };
    const openNotificationWithIcon = type => {
      setTimeout(() => {
        notification[type]({
          message: '欢迎',
          description: `${timeFix()}， 欢迎回来`,
        });
      },1000)
    };

    //验证码
    async function code() {
      const {data:{captchaImage,captchaToken}}= await getCode({});
      state.codeSrc = "data:image/jpeg;base64," +captchaImage; //不会触发虚拟dom操作
      state.form.captchaToken =captchaToken;
      nextTick(()=>{})
    }

    onMounted(async()=>{
        await code();
    })
    /* 返回 */
    return {
      ...toRefs(state),
      handleSubmit,
      handleReset,
      code,
      formRef
    };
  },
});
</script>
<style lang='less' scoped>
.login-container {
  height: 100vh;
  background: url("@/assets/images/login/login_bg.png");
  background-size: cover;
  display:flex;
  align-items: center;
  // justify-content:center;
  &-form {
    // width: calc(100% - 40px);
    // height: 380px;
    // margin-top: calc((100vh - 380px) / 2);
    width: 370px;
    box-sizing: border-box;
    border-radius: 6px;
    width: 370px;
    padding: 16px 28px;
    // background: url("@/assets/images/login/login_form.png");
    // background-size: 100% 100%;
    box-shadow: 0 2px 8px 0 rgba(7, 17, 27, 0.06);
    background-color: #fff;

    header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      img {
        display: inline-block;
        width: 40px;
      }

      h1 {
        margin-bottom: 0;
        color: #1890ff;
        font-weight: 500;
        font-size: 20px;
        letter-spacing: 3px;
        text-decoration: none;
        cursor: pointer;
      }
    }
  }
  .codeFlex :deep(.ant-form-item-control-input-content){
    display:flex;
    align-items: center;
  }
}
</style>