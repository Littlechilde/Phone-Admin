<template>
  <div id="page">
    <!-- 操作项 -->
    <a-row type="flex" justify="start" align="middle" :gutter="16" style="padding-bottom:16px !important;">
      <a-col :span="6">
        <a-space :size="16" align="center">
          <a-button type="primary" @click="showModal"  :loading="loading">新增号段</a-button>
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
        <a-form-item label="主键" name="bigint" :rules="[{ required: true, message: '请输入主键' }]">
          <a-input v-model:value="formState.bigint" placeholder="请输入主键"/>
        </a-form-item>
        <a-form-item label="起始号码" name="startNumber" :rules="[{ required: true, message: '请输入起始号码' }]">
          <a-input v-model:value="formState.startNumber" placeholder="请输入起始号码"/>
        </a-form-item>
        <a-form-item label="结束号码" name="endNumber" :rules="[{ required: true, message: '请输入结束号码' }]">
          <a-input v-model:value="formState.endNumber" placeholder="请输入结束号码"/>
        </a-form-item>
        <a-form-item label="部门名称" name="deptId" :rules="[{ required: true, message: '请选择部门' }]">
          <a-tree-select
            v-model:value="formState.deptId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择部门"
            allow-clear
            :treeDefaultExpandedKeys="[]"
            :tree-data="deptList"
            :field-names="{
              children: 'children',
              label: 'name',
              key: 'deptId',
              value: 'deptId',
            }"
            @change="selectTree"
          >
          </a-tree-select>
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

import {partList} from '@/api/department';
import {userDelete,userDeleteAll,getInfo,getList,saveList,editList} from '@/api/sources';
const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
};
const columns = [{
  title: '主键',
  dataIndex: 'bigint',
  key: 'bigint',
  width: 100
}, {
  title: '部门ID',
  dataIndex: 'deptId',
  key: 'deptId',
  ellipsis: true,
},
 {
  title: '部门名称',
  dataIndex: 'deptName',
  key: 'deptName',
  ellipsis: true,
},
 {
  title: '起始号码',
  dataIndex: 'startNumber',
  key: 'startNumber',
  ellipsis: true,
},
{
  title: '结束号码',
  dataIndex: 'endNumber',
  key: 'endNumber',
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
      bigint:0,
      startNumber:0,
      endNumber:0,
      deptId:0,
      deptName:'',
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
      state.title = '新增号段';
      for (const i in formState){
        if(i=="deptId"){
           formState[i] = null}
        else {formState[i] = ""}
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
        const {code} = await saveList(formState);
        if(code){return false}
      }else{
        //修改
        const {code} = await editList(formState);
        for (const i in formState){
          if(i == "deptName")
            formState[i] = ''
          else formState[i] = 0
        }
        if(code){return false}
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
      const {code} = await userDelete(text.id);
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
            const {code} = await userDeleteAll({bigints:ids});
            if(code){return false};
            message.success('删除成功');
            await queryList();
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
    const selectTree = value => {
      console.log(`selected ${value}`);
      formState.deptId = value;
    };
    
    /**查询信息 */
    async function queryInfo(id){
      const {code,data} = await getInfo(id);
    };
    /*查询列表*/
    async function queryList(){
      if(!state.spinning)
      state.spinning = true;
      const {data:{data,pageNum,pageSize,recordCounts}} = await getList(formState,state.headers);
      state.headers.pageNum = pageNum;
      state.headers.pageSize = pageSize;
      state.recordCounts=recordCounts;
      state.data = data.map(item=>{return {...item,key:item.id}});
      state.spinning =false;
    }
    /**部门 列表*/
    async function getPart(){
      const res = await partList();
      if(res.code){return false};
      state.deptList = formatTree(res,'deptId','parentId','children',0);
    }
    onMounted(async ()=>{
      console.log('---onMounted---');
      await getPart();
      await queryList();
      state.loading =false;
    });
    return {
      ...toRefs(state),
      columns,
      formItemLayout,
      visible,
      confirmLoading,
      formState,
      formRef,
      pagination,
      onFinish,
      selectTree,
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