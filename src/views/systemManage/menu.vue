<template>
  <div id="page">
    <!-- 操作项 -->
    <a-row type="flex" justify="start" align="middle" :gutter="16" style="padding-bottom:16px !important;">
      <a-col :span="6">
        <a-space :size="16" align="center">
          <a-button type="primary" @click="showModal" :loading="loading">新增</a-button>
          <a-button type="primary" danger>批量删除</a-button>
        </a-space>
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
          <template v-if="column.dataIndex === 'icon'">
            <icon-font :type="record.icon" v-if="record.icon" :style="{fontSize:'20px'}"></icon-font>
          </template>
          <template v-if="column.dataIndex === 'perms'">
             <a-tag :color="item=='admin' ? '#f50':'#108ee9' " v-for="(item,index) in text" :key="index">{{item}}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'url'">
             <span v-if="text"><link-outlined /> {{text}}</span>
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
        <a-form-item label="类型" name="type" :rules="[{ required: true, message: '请选择类型' }]">
           <a-radio-group v-model:value="formState.type" @change="typeChange" :disabled="disabled">
            <a-radio :value="0">目录</a-radio>
            <a-radio :value="1">菜单</a-radio>
            <a-radio :value="2">按钮</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="菜单/按钮名称" name="name" :rules="[{ required: true, message: '请输入菜单或按钮名称' }]">
          <a-input v-model:value="formState.name" placeholder="请输入菜单或按钮名称" />
        </a-form-item>
        <a-form-item label="菜单Url" name="url" :rules="[{ required: true, message: '请输入菜单Url' }]" v-if="formState.type != 2" >
          <a-input v-model:value="formState.url" placeholder="请输入菜单Url" :disabled="disabled" />
        </a-form-item>
        <a-form-item label="路由名称" name="routerName" :rules="[{ required: true, message: '请输入路由名称' }]" v-if="formState.type != 2" >
          <a-input v-model:value="formState.routerName" placeholder="请输入路由名称" :disabled="disabled"/>
        </a-form-item>
        <a-form-item label="路由component" name="component" :rules="[{ required: true, message: '请输入component' }]" v-if="formState.type != 2" >
          <a-input v-model:value="formState.component" placeholder="请输入component" :disabled="disabled"/>
        </a-form-item>
        <a-form-item label="菜单/按钮权限" name="perms" :rules="[{ required: true, message: '请输入权限授权' }]">
          <a-input v-model:value="formState.perms" placeholder="权限授权(多个用逗号分隔，如：list,create)" />
        </a-form-item>
        <a-form-item label="图标" name="icon" :rules="[{ required: true, message: '请输入图标样式' }]" v-if="formState.type == 0">
          <a-input v-model:value="formState.icon" placeholder="请输入iconFont图标样式" />
        </a-form-item>

        <a-form-item label="上级菜单" name="parentId" :rules="[{ required: true, message: '请选择上级菜单' }]" v-if="formState.type">
          <a-tree-select
            v-model:value="formState.parentId"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择上级菜单"
            allow-clear
            :treeDefaultExpandedKeys="[]"
            :tree-data="data"
            :field-names="{
              children: 'children',
              label: 'name',
              key: 'menuId',
              value: 'menuId',
            }"
            :disabled="disabled"
            @change="selectTree"
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item label="路由redirect" name="redirect" :rules="[{ required: false, message: '请输入路由redirect' }]" v-if="formState.type != 2" >
          <a-input v-model:value="formState.redirect" placeholder="如需要请输入路由redirect" />
        </a-form-item>
        <a-form-item label="路由隐藏" name="hidden" v-if="formState.type != 2" >
          <a-switch v-model:checked="formState.hidden" @change="checkedHidden"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,} from 'vue';
import { DownOutlined,LinkOutlined,FormOutlined,DeleteOutlined  } from '@ant-design/icons-vue';
import IconFont from "@/assets/iconFont/icon";
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
  width: 150,
  minWidth: 100,
  maxWidth: 300,
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
    LinkOutlined,
    IconFont,
    DeleteOutlined,
    FormOutlined
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
      loading:true,
      disabled:false
    });
    const formState = reactive({
      "children":[],
    	"component": "",
      "hidden": false,
      "icon": "",
      "list": [],
      "menuId": 0,
      "name": "",
      "orderNum": 0,
      "parentId": 0,
      "parentName": "", 
      "perms": "",
      "redirect": "",
      "routerName":"",
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
      for(let i in formState){
        if(i == 'parentId'){
          formState[i] = 0
        }else if(i == 'type'){
          formState[i] = 0
        }else if(i == 'hidden'){
          formState[i] = false;
        }else{
          formState[i] = '';
        }
      }
    };
    const edit = (text) => {
      state.title = '编辑菜单';
      for(let i in formState){
        if(i == 'perms') formState[i] =text[i] ? text[i].toString():'';
        else formState[i] = text[i];
      };
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
        const {code} = await saveMenu(formState);
        if(!code){
          confirmLoading.value = false;
          visible.value = false;
          await queryList();
          message.success('Success');
        }
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
    const selectTree = value => {
      console.log(`selected ${value}`);
      formState.parentId = value;
    };
    const handleFocus = () => {
      console.log('focus');
    };
    const checkedHidden=(checked) => {
      formState.hidden=checked;
      console.log(checked);
    }

    /*查询列表*/
    async function queryList() {
      if(!state.spinning)
      state.spinning = true;
      const res= await menuList({});
      res.forEach((item) => {
        item.key = item.menuId;
        if(item.perms)
        item.perms = item.perms.split(',');
      })
      state.data = formatTree(res,'menuId','parentId','children',0);
      console.log(state.data)
      state.spinning =false;
    }
    onMounted(async ()=>{
      await queryList();
      state.loading = false;
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
      checkedHidden,
      selectTree,
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