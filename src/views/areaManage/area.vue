<template>
  <div id="page">
    <!-- 操作项 -->
    <a-row type="flex" justify="start" align="middle" :gutter="16" style="padding-bottom:16px !important;">
      <a-col :span="6">
        <a-space :size="16" align="center">
          <a-button type="primary" @click="showModal">新增地区</a-button>
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
        <a-form-item label="地区主键" name="id" :rules="[{ required: true, message: '请输入区号' }]">
          <a-input v-model:value="formState.id" placeholder="请输入区号"/>
        </a-form-item>
        <a-form-item label="经度" name="longitude" :rules="[{ required: true, message: '请输入经度' }]">
          <a-input v-model:value="formState.longitude" placeholder="请输入经度"/>
        </a-form-item>
        <a-form-item label="纬度" name="latitude" :rules="[{ required: true, message: '请输入纬度' }]">
          <a-input v-model:value="formState.latitude"  placeholder="请输入纬度"/>
        </a-form-item>
        <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入地区名称' }]">
          <a-input v-model:value="formState.name" placeholder="请输入地区名称"/>
        </a-form-item>
        <a-form-item label="父级" name="pid" :rules="[{ required: true, message: '请输入父级pid' }]">
          <a-input v-model:value="formState.pid" placeholder="请输入父级pid"/>
        </a-form-item>
        <a-form-item label="简称" name="shortname" :rules="[{ required: true, message: '请输入地区简称' }]">
          <a-input v-model:value="formState.shortname" placeholder="请输入地区简称"/>
        </a-form-item>
        <a-form-item label="排序" name="sort" :rules="[{ required: true, message: '请输入地区排序' }]">
          <a-input v-model:value="formState.sort" placeholder="请输入地区排序"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,computed,createVNode} from 'vue';
import { DownOutlined,AimOutlined,DeleteOutlined,FormOutlined,ExclamationCircleOutlined  } from '@ant-design/icons-vue';
import { message,Modal } from 'ant-design-vue';

import {getAreaType} from '@/api/api';
import {partList,getInfo,areaUpdate,areaSave,deleteArea,deleteMore} from '@/api/area';
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
  dataIndex: 'id',
  key: 'id',
  width: 100
}, {
  title: '名称',
  dataIndex: 'name',
  key: 'name',
  ellipsis: true,
},
 {
  title: '父级',
  dataIndex: 'pid',
  key: 'pid',
  ellipsis: true,
},
 {
  title: '简称',
  dataIndex: 'shortname',
  key: 'shortname',
  ellipsis: true,
},
{
  title: '经纬度',
  dataIndex: 'longitude',
  key: 'longitude',
  ellipsis: false,
},
 {
  title: '排序',
  dataIndex: 'sort',
  key: 'sort',
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
    FormOutlined,
    AimOutlined
  },
  setup() {
    const formRef = ref();
    const visible = ref(false);
    const confirmLoading = ref(false);
    const state = reactive({
      selectedRowKeys: [],
      title:'新增地区',
      spinning:true,
      data:[],
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
      pid:"",
      name:'',
      shortname:'',
      longitude:'',
      latitude:'',
      level:0,
      sort:0
    });
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
      state.title = '新增地区';
      for (const i in formState){
        if(i == "level")
         formState[i] = 0
         else formState[i] = ""
      }
      visible.value = true;
    };
    const edit =async (text) => {
      console.log(text)
      let {title} = state;
      title = '编辑地区';
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
      if(state.title=='新增地区'){
        const {code} = await areaSave(formState);
        if(code){return false}
      }else{
        //修改
        const {code} = await areaUpdate(formState);
        for (const i in formState){
          if(i == "level" || i =='id' || i =='sort')
            formState[i] = 0
          else formState[i] = ""
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
    const confirmDel =async text => {
      console.log(text);
      const {code} = await deleteArea(text.id);
      if(code){return false}
      message.success('删除成功');
      queryList();
    };
    const cancelDel = e => {
      console.log(e);
      message.error('Click on No');
    };
    //分页切换
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
            const {code} = await deleteMore(ids);
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
    
    /**查询信息 */
    async function queryInfo(id){
      const {code,data} = await getInfo(id);
    };
    /*查询列表*/
    async function queryList(){
      if(!state.spinning)
      state.spinning = true;
      const {data:{data,pageNum,pageSize,recordCounts}} = await partList(formState,state.headers);
      state.headers.pageNum = pageNum;
      state.headers.pageSize = pageSize;
      state.recordCounts=recordCounts;
      state.data = data.map(item=>{return {...item,key:item.id}});
      state.spinning =false;
    }
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