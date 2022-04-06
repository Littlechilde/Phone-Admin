<template>
  <div id="page">
    <!-- 操作项 -->
    <a-row type="flex" justify="start" align="middle" :gutter="16" style="padding-bottom:16px !important;">
      <a-col :span="6">
        <a-space :size="16" align="center">
          <a-button type="primary" @click="showModal"  :loading="loading">新增设备</a-button>
          <a-button type="primary" danger @click="cleanAll">批量删除</a-button>
        </a-space>
      </a-col>
    </a-row>
    <!-- table开始 -->
    <a-spin :spinning="spinning" tip="Loading...">
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columns" :data-source="data" :pagination="pagination" @change="handleTableChange">
        <!-- v-slot:bodyCell="{text, record, index, column}" 个性化单元格-->
        <template #bodyCell="{ column, text,record }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ text }}</a>
          </template>
          <template v-if="column.dataIndex === 'longitude'">
            <a><aim-outlined /> {{ text }}<a-divider type="vertical" />{{ record.latitude}}</a>
          </template>
          <template v-else-if="column.key === 'action'">
          <span>
            <a @click="edit(text)"><form-outlined /> 编辑</a>
            <a-divider type="vertical" />
            <!-- 操作气泡框 -->
            <a-popconfirm title="你确定要删除吗？" ok-text="是" cancel-text="否" @confirm="confirmDel(text)" @cancel="cancelDel">
              <a href="javascript:;" style="color:#f5222d"><delete-outlined /> 删除</a>
            </a-popconfirm>
          </span>
        </template>
        </template>
      </a-table>
    </a-spin>
    <!-- model开始 -->
    <a-modal v-model:visible="visible" :title="title" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="cancel" ok-text="确认" cancel-text="取消" destroyOnClose>
      <a-form ref="formRef" :model="formState" name="basic" v-bind="formItemLayout" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="关联槽位" name="associatedSlot" :rules="[{ required: true, message: '请输入关联槽位' }]">
          <a-input v-model:value="formState.associatedSlot" placeholder="请输入关联槽位"/>
        </a-form-item>
        <a-form-item label="设备型号" name="deviceModel" :rules="[{ required: true, message: '请输入设备型号' }]">
          <a-input v-model:value="formState.deviceModel" placeholder="请输入设备型号"/>
        </a-form-item>
        <a-form-item label="设备名称" name="deviceName" :rules="[{ required: true, message: '请输入设备名称' }]">
          <a-input v-model:value="formState.deviceName" placeholder="请输入设备名称"/>
        </a-form-item>
        <a-form-item label="安装位置" name="installationSite" :rules="[{ required: true, message: '请输入安装位置' }]">
          <a-input v-model:value="formState.installationSite" placeholder="请输入安装位置"/>  
        </a-form-item>
        <a-form-item label="安装时间" name="installationTime" :rules="[{ required: true, message: '请选择安装时间' }]">
          <a-date-picker v-model:value="formState.installationTime" placeholder="请选择安装时间" show-time style="width:100%" @change="onChangeDate" @ok="onOkDate"/>
        </a-form-item>
        <a-form-item label="关联用户" name="userId" :rules="[{ required: true, message: '请选择关联用户' }]">
          <a-input v-model:value="formState.userId" placeholder="请选择关联用户"/>
        </a-form-item>
        <a-form-item label="用户名" name="userName" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formState.userName" placeholder="请输入用户名"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,computed,createVNode} from 'vue';
import { DownOutlined,AimOutlined,DeleteOutlined,FormOutlined,ExclamationCircleOutlined  } from '@ant-design/icons-vue';
import { message,Modal } from 'ant-design-vue';

import {deviceDelete,deviceList,deviceSave,deviceUpdate,deviceInfo,deviceDeleteBatch} from '@/api/device';
const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
};
const columns = [
{
  title: '设备Id-主键',
  dataIndex: 'id',
  key: 'id',
  ellipsis: true,
},{
  title: '关联槽位',
  dataIndex: 'associatedSlot',
  key: 'associatedSlot',
  width: 100
}, {
  title: '设备型号',
  dataIndex: 'deviceModel',
  key: 'deviceModel',
  ellipsis: true,
},
 {
  title: '设备名称',
  dataIndex: 'deviceName',
  key: 'deviceName',
  ellipsis: true,
},
{
  title: '安装位置',
  dataIndex: 'installationSite',
  key: 'installationSite',
  ellipsis: false,
},
{
  title: '安装时间',
  dataIndex: 'installationTime',
  key: 'installationTime',
  ellipsis: false,
},
{
  title: '关联用户',
  dataIndex: 'userId',
  key: 'userId',
  ellipsis: false,
},
{
  title: '用户名',
  dataIndex: 'userName',
  key: 'userName',
  ellipsis: false,
},
 {
  title: '操作',
  key: 'action',
}
];

export default defineComponent({
  components: {
    DownOutlined,
    DeleteOutlined,
    FormOutlined,
    AimOutlined
  },
  setup() {
    const formRef = ref();
    const visible = ref(false);
    const confirmLoading = ref(false);
    const state = reactive({
      selectedRowKeys: [],
      title:'新增设备',
      spinning:true,
      loading:true,
      data:[],
      deptList:[],
      recordCounts:0,
      headers:{
        pageNum:1,
        pageSize:10,
        orderField:'',
        orderType:''
      },
    });
    const formState = reactive({
      id:0,
      deviceName:'',
      deviceModel:'',
      installationTime:'',
      installationSite:'',
      userId:0,
      userName:'',
      associatedSlot:'',
    });
    //分页
    const pagination = computed(() => ({
      total: state.recordCounts,
      current: state.headers.pageNum,
      pageSize: state.headers.pageSize,
      showTotal:total => `共 ${total} 条`
    }));
    //表格勾选
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };
    const showModal = () => {
      state.title = '新增设备';
      for (const i in formState){
        formState[i] = '';
      };
      visible.value = true;
    };
    const edit =async (text) => {
      console.log(text)
      let {title} = state;
      title = '编辑号段';
      for(const i in formState){
        formState[i] = text[i];
      }
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
      await formRef.value.validateFields();
      confirmLoading.value = true;
      if(state.title=='新增设备'){
        const {code} = await deviceSave(formState);
        if(code){return false}
      }else{
        //修改
        const {code} = await deviceUpdate(formState);
        if(code){return false}
      };
      for (const i in formState){
          if(i == "id" || i == "userId")
            formState[i] = 0;
          else formState[i] = '';
        }
      visible.value = false;
      confirmLoading.value = false;
      message.success('Success');
      await queryList();
    };
    //表单取消
    const cancel=() => {
      console.log('Cancelled')
      confirmLoading.value = false;
      resetForm();
    }
    //删除
    const confirmDel =async text => {
      console.log(text);
      const {code} = await deviceDelete(text.id);
      if(code){return false}
      message.success('删除成功');
      queryList();
    };
    const cancelDel = e => {
      console.log(e);
      message.error('Click on No');
    };
    //分页切换事件
    const handleTableChange = async(pag, filters, sorter)=>{
      console.log(pag, filters, sorter)
      state.headers.pageNum = pag.current;
      state.headers.pageSize = pag.pageSize;
      await queryList();
    };
    //批量删除
    const cleanAll = ()=>{
      if(!state.selectedRowKeys.length){
        message.error('请勾选需要批量删除的列表！')
      }else{
        Modal.confirm({
        title: '你确定要删除以下内容吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
           try {
            const ids = state.selectedRowKeys;
            const {code} = await deviceDeleteBatch({ids:ids});
            if(code){return false};
            message.success('删除成功');
            queryList();
          } catch {
            return console.log('Oops errors!');
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
      }
    };
    //日期选择
    const onChangeDate = (value, dateString) => {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    };
    const onOkDate = value => {
      console.log('onOk: ', value);
    };
    
    /**查询信息 */
    async function queryInfo(id){
      const {code,data} = await getInfo(id);
    };
    /*查询列表*/
    async function queryList(){
      if(!state.spinning);
      state.spinning = true;
      const {data:{data,pageNum,pageSize,recordCounts}} = await deviceList(formState,state.headers);
      state.headers.pageNum = pageNum;
      state.headers.pageSize = pageSize;
      state.recordCounts=recordCounts;
      state.data = data.map(item=>{return {...item,key:item.id}});
      state.spinning =false;
    }

    onMounted(async ()=>{
      console.log('---onMounted---');
      await queryList();
      state.loading =false;
    });
    return {
      ...toRefs(state),
      columns,
      onChangeDate,
      onOkDate,
      formItemLayout,
      visible,
      confirmLoading,
      formState,
      formRef,
      pagination,
      onFinish,
      cleanAll,
      handleTableChange,
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