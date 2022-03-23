<template>
  <div id="page">
    <!-- 操作项 -->
    <a-row type="flex" justify="start" align="middle" :gutter="16" style="padding-bottom:16px !important;">
      <a-col :span="6">
        <a-space :size="16" align="center">
          <a-button type="primary" @click="showModal">新增</a-button>
          <a-button type="primary"  danger>批量删除</a-button>
        </a-space>
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
          <a-input v-model:value="formState.deptId" placeholder="请输入部门ID" allowClear/>
        </a-form-item>
        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formState.username" placeholder="请输入用户名" allowClear/>
        </a-form-item>
        <a-form-item label="手机号" name="mobile" :rules="[{ required: true, message: '请输入正确的手机号',pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,trigger: 'blur',max:11 }]">
          <a-input v-model:value="formState.mobile" :maxlength="11" placeholder="请输入手机号码" allowClear/>
        </a-form-item>
        <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入正确的邮箱',type: 'email' }]">
          <a-input v-model:value="formState.email"  placeholder="请输入邮箱" allowClear/>
        </a-form-item>
        <a-form-item :label="title=='编辑用户' ?'原密码':'密码'" name="password" :rules="[{ required: title=='编辑用户' ? false:true, message: '请输入密码' }]">
          <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword" v-if="title=='编辑用户'">
          <a-input-password v-model:value="formState.newPassword" placeholder="请输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,} from 'vue';
import { DownOutlined  } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import {userList,userUpdate,userPassword,userSave,userDelete} from '@/api/user';
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
      title:'新增用户',
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
      password:'',
      newPassword:''
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
      state.title = '编辑用户';
      formState.deptId = text.deptId;
      formState.username = text.username;
      formState.mobile = text.mobile;
      formState.email = text.email;
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
      const {password,newPassword,...restParams} = values;
      confirmLoading.value = true;
      if(state.title=='新增类型'){
        const {code,msg} = await userSave({password,...restParams});
        if(!code)
        setTimeout(() => {
          visible.value = false;
          message.success(msg);
          confirmLoading.value = false;
          queryList();
          resetForm();
        }, 500);
      }else{
        //修改
         setTimeout(async () => {
          if(password && newPassword)
          await userPassword({password,newPassword});
          const {code,msg} = await userUpdate(restParams);
          if(!code){
            visible.value = false;
            message.success(msg);
            queryList();
          }
          confirmLoading.value = false;
          resetForm();
        }, 500);
      }
    };
    //表单取消
    const cancel=() => {
      console.log('Cancelled')
      confirmLoading.value = false;
      resetForm();
    }
    const confirmDel =async text => {
      console.log(text);
      const {userId}=text;
      const {code,msg} = await userDelete({userIds:userId});
      if(!code){
        message.success(msg);
        queryList();
      }
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