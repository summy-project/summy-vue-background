# CrudTable

这个组件用于一般情况下的列表页。提供了功能按钮和增删改查列表。

## Props

| 属性             | 类型         | 说明                                                   |
| ---------------- | ------------ | ------------------------------------------------------ |
| mode             | 字符串       | 模式，可选值：`table`、`tree`                          |
| loading          | 布尔值       | 是否显示加载动画                                       |
| buttons          | 数组         | 功能按钮数组                                           |
| rowKey           | 字符串       | 必需。唯一标识一行数据的字段名，来源于 data 中的字段。 |
| columns          | 数组         | 列配置，参考 TDesign                                   |
| tableData        | 数组         | 表格数据                                               |
| tableMaxHeight   | 数字或字符串 | 表格本体高度，默认70vh                                 |
| showOperations   | 布尔值       | 是否显示操作插槽，和 <template #operations> 配合使用   |
| rowSelectionType | 布尔值       | 行选择方式，`single` 或 `multiple`。                   |
| virtual          | 布尔值       | 启用虚拟滚动                                           |

## Slots

### #operations

在功能按钮上方，用于存放一些实现业务需要的组件。

例：

```vue
<template #operations>
  <t-input v-model="searchValue" placeholder="在此输入搜索内容..."></t-input>
</template>
```

## Events

| 事件           | 说明                                                          |
| -------------- | ------------------------------------------------------------- |
| @currentChange | 回调函数中有一个参数，会输出选中行的 rowKeys 和选中行的数据。 |
