<template>
  <div>
  <a-button type="primary" @click="showModal"> 新增</a-button>
  <a-button style="margin-left: 20px;">删除</a-button>
  <a-table :columns="columns" :data-source="data">
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">
        <a>{{ text }}</a>
      </template>
    </template>
  </a-table>

    <a-modal
      v-model:visible="visible"
      title="新增"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <!-- <p>{{ modalText }}</p> -->
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="部门"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="起始号码"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

         <a-form-item
          label="结束号码"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <!-- <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item> -->

        <!-- <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent,ref,reactive  } from 'vue';
const columns = [{
  title: '编号',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '起始号码',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '结束号码',
  dataIndex: 'address',
  key: 'address 1',
  ellipsis: true,
}, {
  title: '使用部门',
  dataIndex: 'tags',
  key: 'tags 2',
  ellipsis: true,
}];
const data = [{
  key: '1',
  name: '1',
  age: '01',
  address: '10',
  tags: ['nice', 'developer'],
}, {
  key: '2',
  name: '2',
  age: 11,
  address: '15',
  tags: ['loser'],
}, {
  key: '3',
  name: '3',
  age: 16,
  address: '20',
  tags: ['cool', 'teacher'],
}];
export default defineComponent({
  setup() {
    const modalText = ref('Content of the modal');
    const visible = ref(false);
    const confirmLoading = ref(false);

    const showModal = () => {
      visible.value = true;
    };
    const formState = reactive({
      username: '',
      password: '',
      remember: true,
    });
      const onFinish = values => {
      console.log('Success:', values);
    };

    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };

    const handleOk = () => {
      modalText.value = 'The modal will be closed after two seconds';
      confirmLoading.value = true;
      setTimeout(() => {
        visible.value = false;
        confirmLoading.value = false;
      }, 2000);
    };
    return {
      data,
      columns,
       modalText,
      visible,
      confirmLoading,
       formState,
      onFinish,
      onFinishFailed,
      showModal,
      handleOk,
    };
  },

});
</script>