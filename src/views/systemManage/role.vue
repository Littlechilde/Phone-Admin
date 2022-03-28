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
        <a-form-item label="角色名称" name="roleName" :rules="[{ required: true, message: '请输入角色名称' }]">
          <a-input v-model:value="formState.roleName" placeholder="请输入角色名称"/>
        </a-form-item>
        <a-form-item label="角色类型" name="orgType" :rules="[{ required: true, message: '请选择角色类型' }]">
           <a-radio-group v-model:value="formState.orgType" name="radioGroup">
            <a-radio value="1">超级管理员</a-radio>
            <a-radio value="2">市级用户</a-radio>
            <a-radio value="3">部门用户</a-radio>
          </a-radio-group>
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
        <a-form-item label="备注" name="remark" :rules="[{ required: false, message: '请输入输入备注' }]">
          <a-input v-model:value="formState.remark" placeholder="请输入输入备注"/>
        </a-form-item>
        <a-divider/>
        <div class="tree">
          <main class="listBox">
            <h5>菜单权限</h5>
            <a-tree
              v-model:expandedKeys="expandedKeys"
              v-model:selectedKeys="selectedKeys"
              v-model:checkedKeys="formState.menuIdList"
              checkable
              :tree-data="treeData"
              :field-names="{
                children: 'children',
                label: 'name',
                key: 'menuId',
                value: 'menuId',
              }"
            >
              <template #title="{ name:title,menuId:key }">
                <span v-if="key === '0-0-1-0'" style="color: #FA541C">{{ title }}</span>
                <template v-else>{{ title }}</template>
              </template>
            </a-tree>
          </main>
          <a-divider type="vertical" style="height: auto;" dashed />
          <aside class="listBox">
             <h5>部门权限</h5>
              <a-tree
              v-model:expandedKeys="expandedKeysDepths"
              v-model:selectedKeys="selectedKeysDepths"
              v-model:checkedKeys="formState.deptIdList"
              checkable
              :tree-data="deptList"
              :field-names="{
                children: 'children',
                label: 'name',
                key: 'deptId',
                value: 'deptId',
             }"
            >
              <template #title="{ name }">
                <span style="color: #FA541C">{{ name }}</span>
              </template>
            </a-tree>
          </aside>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs,onMounted,watch } from 'vue';
import { DownOutlined,FormOutlined,DeleteOutlined  } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {formatTree} from '@/utils/formatTree';

// import {getRoleType} from '@/api/api';
import {roleList,menuList,getRoleInfo,roleDelete,roleUpdate,roleAdd} from '@/api/role';
import {partList} from '@/api/department';

const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
};
const columns = [{
  title: '角色ID',
  dataIndex: 'roleId',
  key: 'roleId',
  width: 100
}, {
  title: '角色名称',
  dataIndex: 'roleName',
  key: 'roleName',
}, {
  title: '所属部门',
  dataIndex: 'deptName',
  key: 'deptName',
  ellipsis: true,
},
{
  title: '备注',
  dataIndex: 'remark',
  key: 'remark',
  ellipsis: true,
},
{
  title: '创建时间',
  dataIndex: 'createTime',
  key: 'createTime',
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
    const content = ref('Loading...');
    const expandedKeys = ref([]);
    const selectedKeys = ref([]);
    const expandedKeysDepths = ref([]);
    const selectedKeysDepths = ref([]);

    const state = reactive({
      selectedRowKeys: [],
      title:'新增角色',
      spinning:true,
      data:[],
      key:0,
      loading:true,
      header:{
        pageNum:1,
        pageSize:10,
        orderField:'',
        orderType:''
      },
      treeData:[],
      deptList:[]
    });
    const formState = reactive({
      remark: '',
      roleName:'',
      orgType:'',
      deptId:null,
      deptName:"",
      menuIdList:[],
      deptIdList:[],
      createTime:''
    });

    watch(expandedKeys, () => {
      console.log('expandedKeys', expandedKeys);
    });
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys);
    });
    watch(formState.menuIdList, () => {
      console.log('checkedKeys', formState.menuIdList);
    });

    //表格勾选
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };
    const showModal = () => {
      state.title = '新增角色';
      visible.value = true;
      for (let i in formState){
        if(i=='menuIdList' || i=='deptIdList'){
          formState[i] = []
        }else if(i == 'deptId'){
          formState[i] = null;
        }else{
          formState[i] = ""
        }
      }
    };
    const edit =async (text) => {
      state.title = '编辑类型';
      content.value ='Loading...';
      message.loading({
        content: () => content.value,
      });
      console.log(text)
      const {roleId}=text;
      const {data} = await getRoleInfo(roleId);
      content.value = 'Loaded!';
      for(let i in formState){
        if(i =='deptName') formState[i] = data[i] ? data[i] : text[i];
        else formState[i] = data[i];
      };
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
      if(state.title=='新增角色'){
         const {code} = await roleAdd(formState);
         if(!code){
           visible.value = false;
           message.success('Success');
         }else{ return}
      }else{
        //修改
          const {code} = await roleUpdate(formState);
          if(!code){
            visible.value = false;
            message.success('修改成功');
          }else{ return }
      }
      await queryList();
      confirmLoading.value = false;
    };
    //表单取消
    const cancel=() => {
      confirmLoading.value = false;
      resetForm();
    }
    const confirmDel = async text => {
        const {code} = await roleDelete({roleIds:text.roleId});
        if(!code){
          message.success('删除成功');
          await queryList();
        }
    };
    const cancelDel = e => {
      console.log(e);
      message.error('Click on No');
    };
    const handleChange = value => {
      console.log(`selected ${value}`);
    };
    const selectTree = value => {
      console.log(`selected ${value}`);
      formState.deptId = value;
    };
    
    /*查询role列表*/
    async function queryList() {
      if(!state.spinning)
      state.spinning = true;
      const {header} = state;
      const {data} = await roleList(header);
      const roleData = data.data;
      roleData.map(item=>{item.key = item.roleId});
      state.data = roleData;
      state.spinning =false;
    }
    /**查询Menu列表 */
    async function queryMenu(){
      const res = await menuList();
      state.treeData = formatTree(res,'menuId','parentId','children',0);
      console.log(state.treeData)
    }
    /**部门 列表*/
    async function getPart(){
      const res= await partList();
      state.deptList = formatTree(res,'deptId','parentId','children',0);
    }

    onMounted(async ()=>{
      await queryMenu();
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
      expandedKeys,
      selectedKeys,
      expandedKeysDepths,
      selectedKeysDepths,
      onFinish,
      selectTree,
      handleChange,
      onSelectChange,
      onFinishFailed,
      showModal,
      handleOk,
      cancel,
      confirmDel,
      cancelDel,
      edit,
    };
  },
});
</script>

<style lang="less" scoped>
// 分页边距
 :deep(.ant-pagination) {
  margin: 16px 0 0 0;
}
.tree {
  max-height: 450px;
  overflow: overlay;
  display: flex;
  .listBox{
    width: 50%;
    h5{
      font-size: 16px;
      font-weight: bold;
    }
  }
  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track-piece {
    // background-color: #fff;
    background-color: transparent;
  } /* 滚动条的内层滑轨背景颜色 */
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.06);
    border-radius: 2px;
  }/* 滚动条的内层滑块颜色 */
  &::-webkit-scrollbar-track {
    // background-color: rgba(0, 0, 0, 0.05);
    background-color: transparent;
  } /* 滚动条的外层滑轨背景颜色 */
  & ::-webkit-scrollbar-button {
    background-color: #fff;
    display: none;
  } /* 滑轨两头的监听按钮颜色 */
}
</style>