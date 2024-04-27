<template>
  <CrudTable
    mode="table"
    :buttons="tableButtons"
    row-selection-type="single"
    :columns="tableColumns"
    :filterValue="pageData.filterValue"
    @currentChange="currentChange"
    @filterChange="filterChange"
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
import { getValueBySelectData } from "@/utils/tools";

import { RESERVED_USERS, GENDER_DATA, STATUS_DATA } from "@/common/constants";

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
  editFormMode: "",
  filterValue: {
    id: "",
    userName: "",
    gender: "",
    status: ""
  }
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
      resetValue: "",
      // 按下 Enter 键时也触发确认搜索
      confirmEvents: ["onEnter"],
      showConfirmAndReset: true
    },
    fixed: "left"
  },
  {
    colKey: "userName",
    title: "用户名",
    width: 150,
    filter: {
      type: "input",
      resetValue: "",
      // 按下 Enter 键时也触发确认搜索
      confirmEvents: ["onEnter"],
      showConfirmAndReset: true
    }
  },
  { colKey: "realName", title: "真实姓名", width: 150 },
  {
    colKey: "gender",
    title: "性别",
    width: 150,
    // 根据 gender 值显示不同的性别
    cell: (h, { row }) => {
      return row.genderLabel;
    },
    filter: {
      type: "single",
      list: GENDER_DATA,
      resetValue: "",
      confirmEvents: ["onEnter"],
      showConfirmAndReset: true
    }
  },
  { colKey: "phone", title: "电话号码", width: 200 },
  {
    colKey: "status",
    title: "用户状态",
    width: 150,
    // 根据 userStatus 显示不同的状态标签
    cell: (h, { row }) => {
      return row.statusLabel;
    },
    filter: {
      type: "single",
      list: STATUS_DATA,
      resetValue: "",
      confirmEvents: ["onEnter"],
      showConfirmAndReset: true
    }
  }
]);

// 获取列表数据
const findAllList = async () => {
  pageData.loading = true;
  const resultData = await http("POST", GET_LIST_PATH, pageData.filterValue);
  if (resultData.status === "success") {
    if (resultData.data) {
      pageData.tableData = resultData.data.map((item: Record<string, any>) => {
        return {
          ...item,
          genderLabel: getValueBySelectData(GENDER_DATA, item.gender),
          statusLabel: getValueBySelectData(STATUS_DATA, item.status)
        };
      });
    }
    pageData.loading = false;
  }
};

// 当行选择发生变化时的处理函数
const currentChange = (e: Record<string, any>) => {
  pageData.selectedRow = e.options.selectedRowData[0];
  pageData.selectedRowId = e.options.selectedRowData[0].id;
};

// 过滤事件触发函数
const filterChange = (filters: Record<string, any>) => {
  pageData.filterValue = filters;
  findAllList();
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
