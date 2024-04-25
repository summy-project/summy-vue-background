<template>
  <CrudTable
    mode="table"
    :buttons="tableButtons"
    row-selection-type="single"
    :columns="tableColumns"
    @currentChange="currentChange"
    :tableData="pageData.tableData"
    :loading="pageData.loading"
    :virtual="true"
    :show-operations="false"
  >
  </CrudTable>
  <EditForm
    v-if="pageData.showEditForm"
    :dialogVisible="pageData.showEditForm"
    :mode="pageData.editFormMode"
    :id="pageData.selectedRowId"
    @close="handleDialogClose"
  />
</template>

<script lang="tsx" setup>
import { ref, computed, reactive } from "vue";
import { DialogPlugin, MessagePlugin, type TableProps } from "tdesign-vue-next";

import { http } from "@/utils/fetch";
import { RESERVED_USERS } from "@/common/constants";

import CrudTable from "@/components/Table/CrudTable/index.vue";
import EditForm from "./components/EditForm.vue";

const GET_LIST_PATH = "/user/findAll"; // 查询用户信息接口
const DELETE_ITEM_PATH = "/user/delete"; // 删除接口

const pageData = reactive<Record<string, any>>({
  loading: false,
  tableData: [],
  selectedRow: {},
  selectedRowId: "",
  showEditForm: false,
  editFormMode: ""
});

// 表格操作按钮配置
const tableButtons = computed(() => [
  {
    name: "新增",
    click: () => {
      pageData.editFormMode = "new";
      pageData.showEditForm = true;
    }
  },
  {
    name: "编辑",
    icon: () => {},
    click: () => {
      if (pageData.selectedRowId === "") {
        MessagePlugin.error("没有选中数据或行 ID 异常！");
        return;
      }
      pageData.editFormMode = "edit";
      pageData.showEditForm = true;
    }
  },
  {
    name: "查看",
    click: () => {
      pageData.editFormMode = "view";
      pageData.showEditForm = true;
    }
  },
  {
    name: "删除",
    theme: "danger",
    click: () => {
      if (pageData.selectedRowId === "") {
        MessagePlugin.error("没有选中数据或行 ID 异常！");
        return;
      }
      if (RESERVED_USERS.includes(pageData.selectedRowId)) {
        MessagePlugin.error("不能删除系统保留用户！");
        return;
      }
      const confirmDialog = DialogPlugin({
        header: "警告",
        body: "确定要删除这一条数据吗？",
        confirmBtn: "确定",
        cancelBtn: "取消",
        onConfirm: async () => {
          const deleteData = await http(
            "DELETE",
            `${DELETE_ITEM_PATH}?id=${pageData.selectedRowId}`
          );
          if (deleteData.status === "success") {
            MessagePlugin.success("删除成功！");
            findAllList();
            confirmDialog.hide();
          }
        },
        onClose: () => {
          confirmDialog.hide();
        }
      });
    }
  }
]);

// 表格列配置
const tableColumns = ref<TableProps["columns"]>([
  {
    colKey: "id",
    title: "用户 ID",
    width: 150,
    filter: {
      type: "input",
      confirmEvents: ["onEnter"]
    }
  },
  {
    colKey: "userName",
    title: "用户名",
    width: 150,
    filter: {
      type: "input",
      confirmEvents: ["onEnter"]
    }
  },
  { colKey: "realName", title: "真实姓名", width: 150 },
  {
    colKey: "gender",
    title: "性别",
    width: 150,
    // 根据 gender 值显示不同的性别
    cell: (h, { row }) => {
      if (row.gender == "1") {
        return "男";
      } else if (row.gender == "2") {
        return "女";
      } else {
        return "未指定";
      }
    }
  },
  { colKey: "phone", title: "电话号码", width: 200 },
  {
    colKey: "userStatus",
    title: "用户状态",
    width: 150,
    // 根据 userStatus 显示不同的状态标签
    cell: (h, { row }) => {
      if (row.userStatus == "1") {
        return <t-tag theme="success">已启用</t-tag>;
      } else if (row.userStatus == "2") {
        return <t-tag theme="warning">未启用</t-tag>;
      } else {
        return <t-tag>没有定义</t-tag>;
      }
    }
  }
]);

// 获取列表数据
const findAllList = async () => {
  pageData.loading = true;
  const resultData = await http("GET", GET_LIST_PATH);
  if (resultData.status === "success") {
    if (resultData.data) {
      pageData.tableData = resultData.data;
    }
    pageData.loading = false;
  }
};

// 当行选择发生变化时的处理函数
const currentChange = (e: Record<string, any>) => {
  pageData.selectedRow = e.options.selectedRowData[0];
  pageData.selectedRowId = e.options.selectedRowData[0].id;
};

// 对话框关闭时的处理函数
const handleDialogClose = (e: string) => {
  if (e === "success") {
    MessagePlugin.success("操作成功！");
    findAllList();
  }
  pageData.showEditForm = false;
};

// 初始化列表
findAllList();
</script>
