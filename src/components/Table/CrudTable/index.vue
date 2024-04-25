<!-- 增删改查主表组件 2024.03.10 -->

<template>
  <t-loading :loading="loading" text="正在载入...">
    <t-space direction="vertical" size="small" style="width: 100%">
      <t-space direction="vertical" size="small">
        <t-space size="small" :breakLine="true" v-if="showOperations">
          <slot name="operations"></slot>
        </t-space>
        <t-space size="small" :breakLine="true">
          <t-button
            v-for="item in buttons"
            :key="item"
            :size="item.size || 'medium'"
            :icon="item.icon || undefined"
            :theme="item.theme || 'primary'"
            @click="item.click"
          >
            {{ item.name }}
          </t-button>
        </t-space>
      </t-space>
      <t-table
        v-if="mode === 'table'"
        ref="crudTable"
        :row-key="rowKey || 'id'"
        :activeRowType="rowSelectionType || 'single'"
        :data="tableData"
        :columns="tableColumns"
        table-layout="auto"
        :max-height="tableMaxHeight || '70vh'"
        :row-selection-type="rowSelectionType || 'single'"
        select-on-row-click
        :row-selection-allow-uncheck="true"
        @select-change="handleSelectChange"
        @filter-change="handleFilterChange"
        :scroll="virtual ? { type: 'virtual' } : undefined"
        bordered
        lazy-load
      />
      <t-enhanced-table
        v-if="mode === 'tree'"
        ref="crudTree"
        :row-key="rowKey || 'id'"
        :activeRowType="rowSelectionType || 'single'"
        :data="tableData"
        :columns="tableColumns"
        table-layout="auto"
        :max-height="tableMaxHeight || '70vh'"
        :row-selection-type="rowSelectionType || 'single'"
        select-on-row-click
        :row-selection-allow-uncheck="true"
        @select-change="handleSelectChange"
        :tree="treeOptions"
        :scroll="virtual ? { type: 'virtual' } : undefined"
        bordered
        lazy-load
      />
    </t-space>
  </t-loading>
</template>

<script lang="tsx" setup>
import { ref } from "vue";
import type { TableProps } from "tdesign-vue-next";
import dayjs from "dayjs";

const props = defineProps([
  "mode",
  "loading",
  "buttons",
  "rowKey",
  "columns",
  "treeOptions",
  "tableData",
  "tableMaxHeight",
  "showOperations",
  "rowSelectionType",
  "virtual"
]);

const emits = defineEmits(["currentChange", "filterChange"]);

const tableColumns = ref<TableProps["columns"]>([
  ...props.columns,
  {
    colKey: "createdTime",
    title: "创建时间",
    sorter: true,
    width: 200,
    cell: (h, { row }) => {
      return dayjs(row.createdTime).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  {
    colKey: "updatedTime",
    title: "更新时间",
    width: 200,
    sorter: true,
    cell: (h, { row }) => {
      if (row.updatedTime === null || row.updatedTime === "") {
        return "没有记录";
      }
      return dayjs(row.updatedTime).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  {
    colKey: "remark",
    title: "备注",
    width: 250
  }
]);

const handleSelectChange = (keys: any, options: any) => {
  const emitData = {
    keys,
    options
  };
  emits("currentChange", emitData);
};

const handleFilterChange = (filters: any, ctx: any) => {
  emits("filterChange", filters, ctx);
};
</script>
