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
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,checkStrictly: false, }" :columns="columns" :data-source="data" @resizeColumn="handleResizeColumn">
        <!-- v-slot:bodyCell="{text, record, index, column}" 个性化单元格-->
        <template #bodyCell="{ column, text,record }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ text }}</a>
          </template>
           <template v-if="column.dataIndex === 'type'">
            <a-tag :color="text ? (text==1 ? 'pink' : 'orange') : 'purple'">{{text ? (text==1 ? '菜单' : '按钮') : '目录'}}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'checked'">
            <a-switch v-model:checked="record.checked" disabled/>
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
        <a-form-item label="类型" name="type" :rules="[{ required: true, message: '请选择类型' }]">
           <a-radio-group v-model:value="formState.type" @change="typeChange" :disabled="disabled">
            <a-radio :value="0">目录</a-radio>
            <a-radio :value="1">菜单</a-radio>
            <a-radio :value="2">按钮</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="菜单名称" name="name" :rules="[{ required: true, message: '请输入菜单名称' }]">
          <a-input v-model:value="formState.name" placeholder="请输入菜单名称" />
        </a-form-item>
        <a-form-item label="上级菜单" name="parentId" :rules="[{ required: true, message: '请选择上级菜单' }]" v-if="formState.type">
          <a-select style="width: 100%"  placeholder="请选择上级菜单" v-model:value="formState.parentId"  @focus="handleFocus" @change="handleChange" v-if="formState.type == 1" :disabled="disabled">
            <a-select-option :value="item.menuId" v-for="item in data" :key="item.menuId">{{ item.name }}</a-select-option>
          </a-select>

          <a-select style="width: 100%" @change="handleChange" v-model:value="formState.parentId" placeholder="请选择上级菜单" v-else :disabled="disabled">
            <a-select-opt-group :label="item.name" v-for="item in data" :key="item.menuId">
              <a-select-option :value="i.menuId" v-for="i in item.children" :key="i.menuId">{{i.name}}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        <a-form-item label="菜单Url" name="url" :rules="[{ required: true, message: '请输入菜单Url' }]" v-if="formState.type == 1">
          <a-input v-model:value="formState.url" placeholder="请输入菜单Url" />
        </a-form-item>
        <a-form-item label="图标" name="icon" :rules="[{ required: true, message: '请输入图标样式' }]" v-if="formState.type != 2">
          <a-input v-model:value="formState.icon" placeholder="请输入图标样式" />
        </a-form-item>
        <a-form-item label="授权标识" name="perms" :rules="[{ required: true, message: '请输入授权标识' }]" v-if="formState.type == 2">
          <a-input v-model:value="formState.perms" placeholder="请输入授权标识" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,} from 'vue';
import { DownOutlined  } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

// import {getUserList} from '@/api/api';
import { menuList,saveMenu,updateMenu,deleteMenu } from '@/api/role';
import {formatTree} from '@/utils/formatTree';
const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
};
const columns = ref([{
  title: '菜单ID',
  dataIndex: 'menuId',
  key: 'menuId',
  resizable: true,
  minWidth: 150,
  maxWidth: 300,
  width: 150
}, {
  title: '菜单名称',
  dataIndex: 'name',
  key: 'name',
  resizable: true,
  width: 100,
  minWidth: 100,
  maxWidth: 200,
}, {
  title: '上级菜单',
  dataIndex: 'parentName',
  resizable: true,
  width: 300,
  minWidth: 350,
  maxWidth:500,
  key: 'parentName',
  ellipsis: true,
},
{
  title: '类型',
  dataIndex: 'type',
  key: 'type',
  ellipsis: true,
   width: 100,
},
{
  title: '图标',
  dataIndex: 'icon',
  key: 'icon',
  ellipsis: true,
},
{
  title: '授权标识',
  dataIndex: 'perms',
  key: 'perms',
  ellipsis: true,
},
{
  title: '菜单url',
  dataIndex: 'url',
  key: 'url',
  ellipsis: true,
},
 {
  title: '操作',
  key: 'action',
}
]);

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
      title:'新增菜单',
      spinning:true,
      data:[],
      key:0,
      disabled:false
    });
    const formState = reactive({
     "icon": "",
      "list": [],
      "menuId": 0,
      "name": "",
      "open": true,
      "orderNum": 0,
      "parentId": 0,
      "parentName": "",
      "perms": "",
      "type": 0,
      "url": ""
    });

    //表格勾选
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };
    const showModal = () => {
      state.title = '新增菜单';
      visible.value = true;
      state.disabled = false;
      formState.name='';
      formState.url = '';
      formState.perms='';
      formState.icon='';
      formState.parentId = 0;
      formState.type = 0;
    };
    const edit = (text) => {
      state.title = '编辑菜单';
      formState.name=text.name;
      formState.url = text.url;
      formState.perms=text.perms;
      formState.icon=text.icon;
      formState.parentId = text.parentId;
      formState.type = text.type;
      formState.menuId = text.menuId;
      state.disabled = true;
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
      if(state.title=='新增菜单'){
        await saveMenu(formState);
        confirmLoading.value = false;
        visible.value = false;
        await queryList();
        message.success('Success');
      }else{
        //修改
        await updateMenu(formState);
        confirmLoading.value = false;
        visible.value = false;
        await queryList();
        message.success('Success');
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
      const menuId = text.menuId;
      const {code} = await deleteMenu({menuId});
      if(!code){
        await queryList();
        message.success('success');
      }
    };
    const cancelDel = e => {
      console.log(e);
      message.error('Click on No');
    };
    //radio事件
    const typeChange = (checked) => {
      console.log(checked);
      const {target:{value}} = checked;
      if(state.title == '新增菜单'){
        if(value) formState['parentId'] = undefined;
        else formState['parentId'] = 0;
      }
      formState.type =value;
    }
    const handleChange = value => {
      console.log(`selected ${value}`);
      formState.parentId = value;
    };
    const handleFocus = () => {
      console.log('focus');
    };

    /*查询列表*/
    async function queryList() {
      if(!state.spinning)
      state.spinning = true;
      const res= await menuList({});
      res.forEach((item) => {
        item.key = item.menuId
      })
      state.data = formatTree(res,'menuId','parentId','children',0);
      console.log(state.data)
      state.spinning =false;
    }
    onMounted(async ()=>{
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
      handleResizeColumn: (w, col) => {
        col.width = w;
      },
      onSelectChange,
      handleChange,
      handleFocus,
      onFinishFailed,
      showModal,
      handleOk,
      cancel,
      confirmDel,
      cancelDel,
      typeChange,
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