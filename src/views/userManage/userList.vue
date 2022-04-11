<template>
  <div id="page">
    <!-- 操作项 -->
    <a-row type="flex" justify="start" align="middle" :gutter="16" style="padding-bottom:16px !important;">
      <a-col :span="6">
        <a-space :size="16" align="center">
          <a-button type="primary" @click="showModal"  :loading="loading">新增客户</a-button>
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
          <template v-if="column.dataIndex === 'state'">
            <a-switch v-model:checked="record.state" disabled/>
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
        <a-form-item label="客户名称" name="name" :rules="[{ required: true, message: '请输入客户名称' }]">
          <a-input v-model:value="formState.name" placeholder="请输入客户名称"/>
        </a-form-item>
        <a-form-item label="联系人" name="linkman" :rules="[{ required: true, message: '请输入联系人' }]">
          <a-input v-model:value="formState.linkman" placeholder="请输入联系人"/>
        </a-form-item>
        <a-form-item label="联系人电话" name="phone" :rules="[{ required: true, message: '请输入联系人电话' }]">
          <a-input v-model:value="formState.phone" placeholder="请输入联系人电话"/>
        </a-form-item>
        <a-form-item label="字冠号" name="crown" :rules="[{ required: true, message: '请输入字冠号' }]">
          <a-input v-model:value="formState.crown" placeholder="请输入字冠号"/>
        </a-form-item>
        <a-form-item label="市内通话(元/分)" name="cityCall" :rules="[{ required: true, message: '请输入市内通话(元/分)' }]">
          <a-input v-model:value="formState.cityCall" placeholder="请输入市内通话(元/分)"/>
        </a-form-item>
        <a-form-item label="长途通话(元/分)" name="longCall" :rules="[{ required: true, message: '请输入长途通话(元/分)' }]">
          <a-input v-model:value="formState.longCall" placeholder="请输入长途通话(元/分)"/>
        </a-form-item>
        <a-form-item label="区域" name="areaId" :rules="[{ required: true, message: '请选择区域' }]">
          <a-cascader
            :options="options"
            expand-trigger="click"
            placeholder="请选择区域"
            :load-data="loadData"
            @change="areaChange"
          />
        </a-form-item>
        <a-form-item label="详细地址" name="address" :rules="[{ required: true, message: '请输入详细地址' }]">
          <a-input v-model:value="formState.address" placeholder="请输入详细地址"/>
        </a-form-item>
        <a-form-item label="禁用" name="state" :rules="[{ required: false,}]">
          <a-switch v-model:checked="formState.state" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,computed,createVNode} from 'vue';
import { DownOutlined,AimOutlined,DeleteOutlined,FormOutlined,ExclamationCircleOutlined  } from '@ant-design/icons-vue';
import { message,Modal } from 'ant-design-vue';
import {formatTree} from '@/utils/formatTree';

import {areaList} from '@/api/area';
import {queryCustomer,editCustomer,saveCustomer,deleteCustomer} from '@/api/syscustomer';
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
}, {
  title: '联系人',
  dataIndex: 'linkman',
  key: 'linkman',
  ellipsis: true,
},
 {
  title: '客户名称',
  dataIndex: 'name',
  key: 'name',
  ellipsis: true,
},
{
  title: '字冠号',
  dataIndex: 'crown',
  key: 'crown',
  ellipsis: false,
},
{
  title: '详细地址',
  dataIndex: 'address',
  key: 'address',
  ellipsis: false,
},
{
  title: '联系人电话',
  dataIndex: 'phone',
  key: 'phone',
  ellipsis: false,
},
{
  title: '客户状态',
  dataIndex: 'state',
  key: 'state',
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
      title:'新增客户',
      spinning:true,
      loading:true,
      data:[],
      options:[],
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
      name:0,
      crown:0,
      areaId:0,
      address:'',
      linkman:'',
      phone:'',
      cityCall:'',
      longCall:'',
      state:0,
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
      state.title = '新增客户';
      for (const i in formState){
        if(i=="areaId"){
           formState[i] = null}
        else {formState[i] = ""}
      };
      visible.value = true;
    };
    const edit =async (text) => {
      console.log(text)
      let {title} = state;
      title = '编辑客户';
      formState.name = text.name;
      formState.crown = text.crown;
      // formState.areaId = text.areaId;
      formState.address = text.address;
      formState.linkman = text.linkman;
      formState.phone = text.phone;
      formState.cityCall = text.cityCall;
      formState.longCall = text.longCall;
      formState.state = text.state;
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
      if(state.title=='新增客户'){
        const {code} = await saveCustomer(formState);
        if(code){return false}
      }else{
        //修改
        const {code} = await editCustomer(formState);
        if(code){return false};
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
        if(i == "address" || i == "linkman" || i == "phone" || i == "cityCall" || i == "longCall")
          formState[i] = ''
        else formState[i] = 0
      };
    }
    //删除
    const confirmDel =async text => {
      console.log(text);
      const {code} = await deleteCustomer(text.id);
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
            const {code} = await deleteAllCustomer({ids:ids});
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
    //部门选择
    const loadData = async selectedOptions => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true; // load options lazily
      const {data:{data}} =  await areaList( { pid:targetOption.id},{ pageNum:1,pageSize:30,orderField:'',orderType:''});
      targetOption.loading = false;
      targetOption.children = data.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id,
        isLeaf:item.level == 4 ? true : false,
      }));
      state.options = [...state.options];
    };
    //选择完成回调
    const areaChange= (value,selectedOptions)=>{
      console.log(value,selectedOptions)
      formState.areaId = value[3];
    }
    
    /**查询信息 */
    async function queryInfo(id){
      const {code,data} = await getInfo(id);
    };
    /*查询列表*/
    async function queryList(){
      if(!state.spinning)
      state.spinning = true;
      const {data:{data,pageNum,pageSize,recordCounts}} = await queryCustomer(formState,state.headers);
      state.headers.pageNum = pageNum;
      state.headers.pageSize = pageSize;
      state.recordCounts=recordCounts;
      state.data = data.map((item,index)=>{return {...item,key:index+1}});
      state.spinning =false;
    }
    /**部门 列表*/
    async function getArea(){
      const {data:{data}} =  await areaList({ pid:0},{ pageNum:1,pageSize:40,orderField:'',orderType:''});
      state.options = data.map((item,index)=>{return {...item,label:item.name,value:item.id,isLeaf:false}});
    }
    onMounted(async ()=>{
      console.log('---onMounted---');
      await getArea();
      await queryList();
      state.loading =false;
    });
    return {
      ...toRefs(state),
      columns,
      areaChange,
      formItemLayout,
      visible,
      confirmLoading,
      formState,
      formRef,
      pagination,
      onFinish,
      loadData,
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