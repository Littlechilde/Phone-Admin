<template>
  <div id="page">
    <!-- 操作项 -->
    <a-row type="flex" justify="start" align="middle" :gutter="16" style="padding-bottom:16px !important;">
      <a-col :span="6">
        <a-button type="primary" @click="showModal">新增</a-button>
        <a-button type="primary" style="margin-left: 16px;" danger>批量删除</a-button>
      </a-col>
    </a-row>
    <!-- table开始 -->
    <a-spin :spinning="spinning" tip="Loading...">
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columns" :data-source="data">
        <!-- v-slot:bodyCell="{text, record, index, column}" 个性化单元格-->
        <template #bodyCell="{ column, text,record }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ text }}</a>
          </template>
          <template v-else-if="column.key === 'action'">
          <span>
            <a @click="edit(column, text,record)">编辑</a>
            <a-divider type="vertical" />
            <!-- 操作气泡框 -->
            <a-popconfirm title="你确定要删除吗？" ok-text="是" cancel-text="否" @confirm="confirmDel(text)" @cancel="cancelDel">
              <a href="javascript:;" style="color:#f5222d">删除</a>
            </a-popconfirm>
          </span>
        </template>
        </template>
      </a-table>
    </a-spin>
    <!-- model开始 -->
    <a-modal v-model:visible="visible" :title="title" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="cancel" ok-text="确认" cancel-text="取消" destroyOnClose>
      <a-form ref="formRef" :model="formState" name="basic" v-bind="formItemLayout" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="部门ID" name="deptId" :rules="[{ required: true, message: '请输入部门ID' }]">
          <a-input v-model:value="formState.deptId" />
        </a-form-item>
        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formState.username" />
        </a-form-item>
        <a-form-item label="手机号" name="mobile" :rules="[{ required: true, message: '请输入手机号' }]">
          <a-input v-model:value="formState.mobile" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,} from 'vue';
import { DownOutlined  } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import {userList,userUpdate} from '@/api/user';
const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
};
const columns = [{
  title: '序号',
  dataIndex: 'key',
  key: 'key',
  width: 100
},
{
  title: '部门名称',
  dataIndex: 'deptName',
  key: 'deptName',//Vue 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
},
 {
  title: '用户名',
  dataIndex: 'username',
  key: 'username',
}, {
  title: '手机号',
  dataIndex: 'mobile',
  key: 'mobile',
  ellipsis: true,
},
{
  title: '邮箱',
  dataIndex: 'email',
  key: 'email',
},
{
  title: '角色ID列表',
  dataIndex: 'roleIdList',
  key: 'roleIdList',
  },
 {
  title: '操作',
  key: 'action',
}
];

export default defineComponent({
  components: {
    DownOutlined,
  },
  setup() {
    const formRef = ref();
    const visible = ref(false);
    const confirmLoading = ref(false);
    const state = reactive({
      selectedRowKeys: [],
      title:'新增类型',
      spinning:true,
      data:[],
      key:0,
    });
    const formState = reactive({
      username: '',
      mobile:'',
      email: '',
      deptId:0,
      roleIdList:[],
      password:''
    });

    //表格勾选
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };
    const showModal = () => {
      state.title = '新增类型';
      visible.value = true;
      for(let i in formState){
        formState[i] = ''
      }
    };
    const edit = (column, text,record) => {
      state.title = '编辑类型';
      formState.deptId = text.deptId;
      formState.username = text.username;
      formState.mobile = text.mobile;
      formState.email = text.email;
      console.log(state.formState);
      visible.value = true;
    }
    const onFinish = values => {
      console.log('Success:', values);
    };
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    //重置表单
    const resetForm = () => {
      formRef.value.resetFields();
    };
    //表单提交
    const handleOk =async () => {
      const values = await formRef.value.validateFields();
      confirmLoading.value = true;
      if(state.title=='新增类型'){
        setTimeout(() => {
          visible.value = false;
          //模拟add
          state.data.push({...values,key:state.data.length+1,number:state.data.length+1});
          console.log(state.data)
          confirmLoading.value = false;
          message.success('Success');
          resetForm();
        }, 1000);
      }else{
        //修改
         setTimeout(async () => {
          const {code} = await userUpdate(formState);
          if(!code){
            visible.value = false;
            message.success('Success');
            queryList();
          }
          confirmLoading.value = false;
          resetForm();
        }, 400);
      }
    };
    //表单取消
    const cancel=() => {
      console.log('Cancelled')
      confirmLoading.value = false;
      resetForm();
    }
    const confirmDel = text => {
      console.log(text);
      setTimeout(() =>{
        state.data = state.data.filter((item ,index)=>item.key != text.key);
        message.success('删除成功');
      },1000)
    };
    const cancelDel = e => {
      console.log(e);
      message.error('Click on No');
    };
    
    /*查询列表*/
    async function queryList() {
      if(!state.spinning)
      state.spinning = true;
      const {data:{data}} = await userList({});
      state.data = data.map((item,index)=>{
        return {key:index+1, ...item}
      });
      state.spinning =false;
    };

    onMounted(async ()=>{
      console.log('---onMounted---');
      await queryList();
    });
    return {
      ...toRefs(state),
      columns,
      formItemLayout,
      visible,
      confirmLoading,
      formState,
      formRef,
      onFinish,
      onSelectChange,
      onFinishFailed,
      showModal,
      handleOk,
      cancel,
      confirmDel,
      cancelDel,
      edit
    };
  },
});
</script>

<style lang="less" scoped>
// 分页边距
 :deep(.ant-pagination) {
  margin: 16px 0 0 0;
}
</style>