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
           <template v-if="column.dataIndex === 'describe'">
            <a>{{ text }}</a>
          </template>
          <template v-else-if="column.key === 'action'">
          <span>
            <a @click="edit(text)">编辑</a>
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
        <a-form-item label="选择通话类型" name="callType" :rules="[{ required: true, message: '请选择通话类型' }]">
          <!-- <a-input v-model:value="formState.callType" /> -->
          <a-select
            v-model:value="value"
            show-search
            placeholder="Select a person"
            style="width: 200px"
            :options="options"
            :filter-option="filterOption"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
          ></a-select>
        </a-form-item>
        <a-form-item label="计价" name="describe" :rules="[{ required: true, message: '请输入计价' }]">
          <a-input-number id="inputNumber" v-model:value="formState.describe" :min="1" :max="10" >
            <template #addonAfter>
              <span>元/分钟</span>
            </template>
          </a-input-number>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,} from 'vue';
import { DownOutlined  } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import {getPayType} from '@/api/api';
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
  dataIndex: 'number',
  key: 'number',
  width: 100
}, {
  title: '通话类型',
  dataIndex: 'callType',
  key: 'callType',
}, {
  title: '计价/分钟',
  dataIndex: 'describe',
  key: 'describe',
  ellipsis: true,
},
 {
  title: '操作',
  key: 'action',
}
];

const options = ref([{
    value: '市话',
    label: '市话',
  }, {
    value: '长途',
    label: '长途',
  }]);

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
      callType: '',
      describe: 0,
    });

    const handleChange = value => {
      console.log(`selected ${value}`);
    };
    const handleBlur = () => {
      console.log('blur');
    };
    const handleFocus = () => {
      console.log('focus');
    };
    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    //表格勾选
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };
    const showModal = () => {
      state.title = '新增类型';
      visible.value = true;
      formState.callType = '';
      formState.describe = '';
    };
    const edit = (text) => {
      state.title = '编辑类型';
      formState.callType = text.callType;
      formState.describe = parseFloat(text.describe);
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
         setTimeout(() => {
          visible.value = false;
          state.data[Number(state.key)-1]={...values,key:state.data.length+1,number:state.data.length+1};
          confirmLoading.value = false;
          message.success('Success');
          resetForm();
        }, 2000);
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
    async function queryType() {
      if(!state.spinning)
      state.spinning = true;
      const {data} = await getPayType({});
      state.data = data;
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
      value: ref(undefined),
      filterOption,
      handleBlur,
      handleFocus,
      handleChange,
      options,
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