<template>
  <t-dialog
    :width="width ? width : '40%'"
    :visible="showDialog"
    :on-confirm="handleConfirm"
    :on-close="handleCancel"
    :on-cancel="handleCancel"
  >
    <template #header>{{ title || "选择内容" }} </template>

    <t-table
      v-if="mode === 'table'"
      ref="selectTable"
      :row-key="rowKey || 'id'"
      :data="tableData"
      :columns="tableColumns"
      table-layout="auto"
      :max-height="tableMaxHeight || 300"
      select-on-row-click
      :row-selection-allow-uncheck="true"
      @select-change="handleSelectChange"
      :scroll="virtual ? { type: 'virtual' } : undefined"
      bordered
      lazy-load
    />
    <t-enhanced-table
      v-if="mode === 'tree'"
      ref="selectTable"
      :row-key="rowKey || 'id'"
      :data="tableData"
      :columns="tableColumns"
      table-layout="auto"
      :treeOptions="treeOptions"
      :max-height="tableMaxHeight || 300"
      select-on-row-click
      :row-selection-allow-uncheck="true"
      @select-change="handleSelectChange"
      :scroll="virtual ? { type: 'virtual' } : undefined"
      bordered
      lazy-load
    />
  </t-dialog>
</template>

<script lang="tsx" setup>
import { reactive, ref } from "vue";

const visible = ref(false);

const props = defineProps([
  "mode",
  "title",
  "width",
  "loading",
  "showDialog",
  "rowKey",
  "treeOptions",
  "rowSelectionType",
  "tableData",
  "columns",
  "tableMaxHeight",
  "virtual"
]);

const emits = defineEmits(["onCancel", "onConfirm", "currentChange"]);

const tableColumns = reactive([
  {
    colKey: "row-select",
    type: props.rowSelectionType,
    width: 50
  },
  ...props.columns
]);

const selectedRow = reactive({
  keys: [],
  options: {}
});

const handleSelectChange = (keys: any, options: any) => {
  selectedRow.keys = keys;
  selectedRow.options = options;
};

const handleCancel = () => {
  emits("onCancel", visible);
};

const handleConfirm = () => {
  emits("onConfirm", selectedRow);
};
</script>
