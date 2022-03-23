<template>
  <div id="page">
    <!-- 操作项 -->
    <a-row type="flex" justify="start" align="middle" :gutter="16" style="padding-bottom:16px !important;">
      <a-col :span="6">
        <a-space :size="16" align="center">
          <a-button type="primary" @click="showModal">新增同级</a-button>
          <a-button @click="showModal({child:true})" type="primary" danger>新增子级</a-button>
          <!-- <a-button type="primary" danger>批量删除</a-button> -->
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
          <template v-else-if="column.dataIndex === 'parentName'">
            <a-tag color="purple" v-if="text">{{text}}</a-tag>
            <a-tag color="red" v-else>暂无</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'describe'">
            <a-badge color="#f50" :text="text" />
          </template>
          <template v-else-if="column.key === 'action'">
          <span>
            <a @click="edit(text)"><form-outlined /> 编辑</a>
            <a-divider type="vertical" />
            <!-- 操作气泡框 -->
            <a-popconfirm title="你确定要删除吗？" ok-text="是" cancel-text="否" @confirm="confirmDel(text)" @cancel="cancelDel">
              <a href="javascript:;" style="color:#f5222d"><delete-outlined /> 删除</a>
            </a-popconfirm>
            <!-- <a-divider type="vertical" />
            <a class="ant-dropdown-link">
              更多操作
              <down-outlined />
            </a> -->
          </span>
        </template>
        </template>
      </a-table>
    </a-spin>
    <!-- model开始 -->
    <a-modal v-model:visible="visible" :title="title" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="cancel" ok-text="确认" cancel-text="取消" destroyOnClose>
      <a-form ref="formRef" :model="formState" name="basic" v-bind="formItemLayout" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="部门名称" name="name" :rules="[{ required: true, message: '请输入话单类型' }]">
          <a-input v-model:value="formState.name" placeholder="请输入部门名称"/>
        </a-form-item>
        <a-form-item label="描述" name="describe"  :rules="[{ required: true, message: '请输入相关描述' }]">
          <a-input v-model:value="formState.describe" placeholder="请输入相关描述"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,toRef,onMounted,toRaw} from 'vue';
import { DownOutlined,DeleteOutlined,FormOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {formatTree} from '@/utils/formatTree';

import {getCallType} from '@/api/api';
const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 18,
    },
};
const columns = [{
  title: '序号',
  dataIndex: 'menuId',
  key: 'menuId',
  width: 200
}, {
  title: '部门名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '上级部门',
  dataIndex: 'parentName',
  key: 'parentName',
  ellipsis: true,
},
{
  title: '相关描述',
  dataIndex: 'describe',
  key: 'describe',
  ellipsis: true,
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
    FormOutlined
  },
  setup() {
    const formRef = ref();
    const visible = ref(false);
    const confirmLoading = ref(false);
    const state = reactive({
      selectedRowKeys: [],
      title:'新增同级',
      spinning:true,
      data:[],
      dataOriginal:[],
      key:0,
      selectedRows:[]
    });
    const formState = reactive({
      menuId: 0,
      name:'',
      describe: '',
    });

    //表格勾选
    const onSelectChange = (selectedRowKeys,selectedRows )=> {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      console.log(selectedRows)
      state.selectedRowKeys = selectedRowKeys;
      state.selectedRows=selectedRows;
    };
    const showModal = ({child}) => {
      if(child) state.title = '新增子级';
      else state.title = '新增同级';
      formState.name = '';
      formState.describe ='';
      if(state.selectedRowKeys.length==1 || (!state.data.length&&state.title == '新增同级'))
      visible.value = true;
      else message.error('请勾选需要新增的列表，仅能勾选一项！')
    };
    const edit = (text) => {
      state.title = '编辑类型';
      formState.name = text.name;
      formState.describe = text.describe;
      state.key = text.key;
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
      const {dataOriginal,title} = state; 
      confirmLoading.value = true;
      if(title=='新增同级'){
        setTimeout(() => {
          //模拟add
          if(state.data.length >0){
            const {selectedRows:[{parentId,parentName}]} = state;
            dataOriginal.push({...values,parentId,parentName,key:dataOriginal.length+1,menuId:dataOriginal.length+1});
          }else{
            const parentId = 0;
            const parentName="";
            dataOriginal.push({...values,parentId,parentName,key:dataOriginal.length+1,menuId:dataOriginal.length+1});
          }
          state.data=formatTree(dataOriginal,'menuId','parentId','children',0);
          confirmLoading.value = false;
          visible.value = false;
          message.success('Success');
        }, 1000);
      }else if(title=='新增子级'){
        const {selectedRows:[{menuId,name}]} = state;
        setTimeout(() => {
          visible.value = false;
          //模拟add
          dataOriginal.push({...values,parentId:menuId,parentName:name,key:dataOriginal.length+1,menuId:dataOriginal.length+1});
          state.data=formatTree(dataOriginal,'menuId','parentId','children',0);
          confirmLoading.value = false;
          message.success('Success');
        }, 1000);
      }
      else{
        //修改
         state.spinning = true;
         setTimeout(() => {
          visible.value = false;
          dataOriginal[Number(state.key)-1]={...dataOriginal[Number(state.key)-1],...values};
          state.data=formatTree(dataOriginal,'menuId','parentId','children',0); //修改部分 覆盖
          confirmLoading.value = false;
          state.spinning = false;
          message.success('Success');
          resetForm();
        }, 1000);
      }
    };
    //表单取消
    const cancel=() => {
      console.log('Cancelled')
      confirmLoading.value = false;
      resetForm();
    }
    const confirmDel = text => {
      state.spinning =true;
      const raw =toRaw(state.dataOriginal);
      raw.map(item=>{
        if(item.children && item.children.length>0){
            delete item.children
        }
      });
      console.log(raw)
      setTimeout(() =>{
        state.dataOriginal = raw.filter((item ,index)=>item.key != text.key);
        state.data=formatTree(state.dataOriginal,'menuId','parentId','children',0);
        message.success('删除成功');
        state.spinning =false;
      },1000)
    };
    const cancelDel = e => {
      console.log(e);
      message.error('Click on No');
    };
    
    /*查询列表*/
    async function queryType() {
      if(!state.spinning)
      state.spinning = true;
      const {data} = await getCallType({});
      data.map(item=>{
        item.key = item.menuId
      });
      state.dataOriginal = data;
      state.data = formatTree(data,'menuId','parentId','children',0);
      console.log(state.data);
      state.spinning =false;
    }
    onMounted(async ()=>{
      console.log('---onMounted---');
      await queryType();
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