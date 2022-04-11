<template>
  <div id="page">
    <!-- 操作项 -->
    <a-row justify="space-around" align="middle" :gutter="16" style="padding-bottom:16px !important;">
      <a-col :span="20">
        <a-form :model="formState" name="horizontal_login" layout="inline" autocomplete="off"  @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item name="range-time-picker" label="时间段" v-bind="rangeConfig">
            <a-range-picker v-model:value="formState['range-picker']" value-format="YYYY-MM-DD" />
          </a-form-item>
          <a-form-item label="通话类型" name="callType" :rules="[{ required: false, message: 'Please input your password!' }]" :wrapperCol="{ style: 'width: 120px' }">
            <a-select v-model:value="formState.callType" style="width: 100%" placeholder="请选择类型">
              <a-select-option value="1">市类通话</a-select-option>
              <a-select-option value="2">长途通话</a-select-option>
              <a-select-option value="3">特殊号码</a-select-option>
              <a-select-option value="4">集团通话</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="主叫号码" name="password" :rules="[{ required: false, message: 'Please input your password!' }]"  :wrapperCol="{ style: 'width: 150px' }">
            <a-input v-model:value="formState.password" placeholder="请输入主叫号码"></a-input>
          </a-form-item>
          <a-form-item label="被叫号码" name="password" :rules="[{ required: false, message: 'Please input your password!' }]"  :wrapperCol="{ style: 'width: 150px' }">
            <a-input v-model:value="formState.password" placeholder="请输入被叫号码"></a-input>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="4" :style="{display:'flex',justifyContent:'flex-end'}">
        <a-space :size="16" align="center">
          <a-button type="primary">查询</a-button>
          <a-button type="primary" danger>导出</a-button>
        </a-space>
      </a-col>
    </a-row>
    <!-- table开始 -->
    <a-spin :spinning="spinning" tip="Loading...">
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columns" :data-source="data" :pagination="pagination" @change="handleTableChange">
        <!-- v-slot:bodyCell="{text, record, index, column}" 个性化单元格-->
        <template #bodyCell="{ column, text,record }">
          <template v-if="column.dataIndex === 'key'">
            <a>{{ text }}</a>
          </template>
          <template v-if="column.dataIndex === 'pay'">
            <a>{{text}}</a>
          </template>
          <template v-else-if="column.key === 'action'">
          <span>
            <!-- 操作气泡框 -->
            <a-popconfirm title="你确定要删除吗？" ok-text="是" cancel-text="否" @confirm="confirmDel(text)" @cancel="cancelDel">
              <a href="javascript:;" style="color:#f5222d"><delete-outlined /> 删除</a>
            </a-popconfirm>
          </span>
        </template>
        </template>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,computed,createVNode} from 'vue';
import { DownOutlined,AimOutlined,DeleteOutlined,FormOutlined,ExclamationCircleOutlined  } from '@ant-design/icons-vue';
import { message,Modal } from 'ant-design-vue';
import {formatTree} from '@/utils/formatTree';

import {listManage,deleteManage,deleteBatchManage,queryManage,saveManage,updateManage} from '@/api/phoneManage';
import {getDefault} from '@/api/api';
const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
};
const rangeConfig = {
  rules: [{
    type: 'array',
    required: false,
    message: 'Please select time!',
  }],
};
const columns = [
{
  title: '序号',
  dataIndex: 'key',
  key: 'key',
  ellipsis: true,
  width: 100
},{
  title: '主叫号码',
  dataIndex: 'mainNumber',
  key: 'mainNumber',
  ellipsis: true,
},
 {
  title: '被叫号码',
  dataIndex: 'resolveNumber',
  key: 'resolveNumber',
  ellipsis: true,
},
{
  title: '通话时长',
  dataIndex: 'callTime',
  key: 'callTime',
  ellipsis: false,
},
{
  title: '通话类型',
  dataIndex: 'callType',
  key: 'callType',
  ellipsis: false,
},
{
  title: '话费',
  dataIndex: 'pay',
  key: 'pay',
  ellipsis: false,
},
{
  title: '被叫地区',
  dataIndex: 'area',
  key: 'area',
  ellipsis: false,
},
{
  title: '计费字段',
  dataIndex: 'payMark',
  key: 'payMark',
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
      title:'新增号段',
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
      "bigint": 0,
      "deptId": 0,
      "deptName": "",
      "endNumber": 0,
      "startNumber": 0,
      callType:null,
      'range-picker':[],
    });
    //分页
    const pagination = computed(() => ({
      total: state.recordCounts,
      current: state.headers.pageNum,
      pageSize: state.headers.pageSize,
      showTotal:total => `总通话数： ${total} 条，总通话时间：0.5小时，总通话费用：1.2元`
    }));
    //表格勾选
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };
    const showModal = () => {
      state.title = '新增号段';
      for (const i in formState){
        if(i== 'deptId')
        formState[i] = null;
        else formState[i] = '';
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
      if(state.title=='新增号段'){
        const {code} = await saveManage(formState);
        if(code){return false}
      }else{
        //修改
        const {code} = await updateManage(formState);
        if(code){return false}
      };
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
      for (const i in formState){
        if(i== 'deptName')
        formState[i] = '';
        else formState[i] = 0;
      };
    }
    //删除
    const confirmDel =async text => {
      console.log(text);
      const {code} = await deleteManage(text.id);
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
            const {code} = await deleteBatchManage({bigints:ids});
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
    //部门选择
    const selectTree = (value,label) => {
      console.log(`selected ${value}`);
      formState.deptId = value;
      formState.deptName = label;
    };
    
    /**查询信息 */
    async function queryInfo(id){
      const {code,data} = await queryManage(id);
    };
    /*查询列表*/
    async function queryList(){
      if(!state.spinning);
      state.spinning = true;
      const {data} = await getDefault({});
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
      rangeConfig,
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
      selectTree,
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