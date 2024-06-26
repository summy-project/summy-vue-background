<template>
  <CrudTable
    mode="tree"
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
import { getValueBySelectData } from "@/utils/tools";

import { STATUS_DATA } from "@/common/constants";

import CrudTable from "@/components/Table/CrudTable/index.vue";
import EditForm from "./components/EditForm.vue";

const GET_LIST_PATH = "/system/menu/findAll"; // 查询用户信息接口
const DELETE_ITEM_PATH = "/system/menu/delete"; // 删除接口

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
    colKey: "name",
    title: "菜单名称",
    fixed: "left"
  },
  {
    colKey: "code",
    title: "菜单代号"
  },
  {
    colKey: "sort",
    title: "排序"
  },
  {
    colKey: "status",
    title: "状态",
    cell: (h, { row }) => {
      return row.statusLabel;
    }
  }
]);

// 获取列表数据
const findAllList = async () => {
  pageData.loading = true;
  const resultData = await http("GET", GET_LIST_PATH);
  if (resultData.status === "success") {
    if (resultData.data) {
      pageData.tableData = resultData.data.map((item: Record<string, any>) => {
        return {
          ...item,
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

// 对话框关闭时的处理函数
const handleDialogClose = (e: string) => {
  if (e === "success") {
    MessagePlugin.success("操作成功，侧边栏将在下一次登录时更新。");
    findAllList();
  }
  pageData.showEditForm = false;
};

// 初始化列表
findAllList();
</script>
