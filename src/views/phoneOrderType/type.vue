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
    <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columns" :data-source="data">
      <!-- v-slot:bodyCell="{text, record, index, column}" 个性化单元格-->
      <template #bodyCell="{ column, text,record }">
        <template v-if="column.dataIndex === 'name'">
          <a>{{ text }}</a>
        </template>
        <template v-else-if="column.key === 'action'">
        <span>
          <a @click="edit">编辑</a>
          <a-divider type="vertical" />
          <!-- 操作气泡框 -->
          <a-popconfirm title="你确定要删除吗？" ok-text="是" cancel-text="否" @confirm="confirmDel" @cancel="cancelDel">
            <a href="javascript:;" style="color:#f5222d">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            更多操作
            <down-outlined />
          </a>
        </span>
      </template>
      </template>
    </a-table>

    <!-- model开始 -->
    <a-modal v-model:visible="visible" :title="title" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="cancel" ok-text="确认" cancel-text="取消" destroyOnClose>
      <a-form ref="formRef" :model="formState" name="basic" v-bind="formItemLayout" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="类型" name="callType" :rules="[{ required: true, message: '请输入话单类型' }]">
          <a-input v-model:value="formState.callType" />
        </a-form-item>
        <a-form-item label="描述" name="describe" :rules="[{ required: true, message: '请输入相关描述' }]">
          <a-input v-model:value="formState.describe" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs} from 'vue';
import { DownOutlined  } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
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
  dataIndex: 'name',
  key: 'name',
  width: 100
}, {
  title: '类型名称',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '描述',
  dataIndex: 'address',
  key: 'address 1',
  ellipsis: true,
},
 {
  title: '操作',
  key: 'action',
}
];
const data = [{
  key: '1',
  name: '1',
  age: '市话',
  address: '',
  tags: ['nice', 'developer'],
}, {
  key: '2',
  name: '2',
  age: '国际长途',
  address: '',
  tags: ['loser'],
}, {
  key: '3',
  name: '3',
  age: '市话',
  address: '',
  tags: ['cool', 'teacher'],
}];
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
      title:'新增类型'
    });
    const formState = reactive({
      callType: '',
      describe: '',
      remember: true,
    });

    //表格勾选
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };
    const showModal = () => {
      visible.value = true;
    };
    const edit = () => {
      state.title = '编辑类型';
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
      console.log('Success:', values);
      confirmLoading.value = true;
      setTimeout(() => {
        visible.value = false;
        confirmLoading.value = false;
        resetForm();
      }, 2000);
    };
    //表单取消
    const cancel=() => {
      console.log('Cancelled')
      resetForm();
    }
    const confirmDel = e => {
      console.log(e);
      message.success('Click on Yes');
    };
    const cancelDel = e => {
      console.log(e);
      message.error('Click on No');
    };

    return {
      ...toRefs(state),
      data,
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