<template>
  <!-- 弹窗对话框，根据mode的不同显示不同的标题，支持新增、编辑和查看操作 -->
  <t-drawer
    :visible="dialogVisible"
    :header="
      mode == 'new'
        ? '新增'
        : mode == 'edit'
          ? '编辑'
          : mode == 'view'
            ? '查看'
            : ''
    "
    @confirm="handleSubmit"
    @cancel="handleClose"
    @close="handleClose"
    size="40%"
  >
    <!-- 表单，用于输入用户信息，密码字段为密码类型 -->
    <t-form
      ref="formInstance"
      :data="pageData.formData"
      :rules="pageData.formRules"
      :disabled="pageData.readOnly"
    >
      <t-form-item label="菜单名称" name="name">
        <t-input v-model="pageData.formData.name" />
      </t-form-item>
      <t-form-item label="菜单代号" name="code">
        <t-input
          v-model="pageData.formData.code"
          placeholder="应与前端路由页面的 name 保持一致。"
        />
      </t-form-item>
      <t-form-item label="PC 端图标" name="pcIcon">
        <t-input v-model="pageData.formData.pcIcon" />
      </t-form-item>
      <t-form-item label="PC 端路由" name="pcRoute">
        <t-input v-model="pageData.formData.pcRoute" />
      </t-form-item>
      <t-form-item label="移动端图标" name="mobileIcon">
        <t-input v-model="pageData.formData.mobileIcon" />
      </t-form-item>
      <t-form-item label="移动端路由" name="mobileRoute">
        <t-input v-model="pageData.formData.mobileRoute" />
      </t-form-item>
      <t-form-item label="父级菜单" name="parentName">
        <t-input
          v-model="pageData.formData.parentName"
          @click="pageData.showMenuSelect = true"
          placeholder="点击右边的按钮选择"
          disabled
        >
          <template #suffixIcon>
            <search-icon :style="{ cursor: 'pointer' }" />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item
        label="查看权限"
        name="roleIds"
        help="请确保：父级菜单需包含其所有子级菜单的权限设置；顶级菜单必须涵盖下级所有菜单的权限，否则相关菜单将不可见。"
      >
        <t-select v-model="pageData.formData.roleIds" multiple>
          <t-option
            v-for="item in pageData.roleSelectData"
            :key="item"
            :label="`${item.roleName}（${item.id}）`"
            :value="item.id"
          ></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="菜单状态" name="status">
        <t-select v-model="pageData.formData.status">
          <t-option
            v-for="item in STATUS_DATA"
            :key="item"
            :label="item.label"
            :value="item.value"
          ></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="备注" name="remark">
        <t-textarea v-model="pageData.formData.remark" />
      </t-form-item>
    </t-form>
  </t-drawer>
  <SelectTable
    v-if="pageData.showMenuSelect"
    :showDialog="pageData.showMenuSelect"
    mode="tree"
    width="60%"
    rowSelectionType="single"
    :tableData="pageData.menuSelectData"
    :columns="pageData.menuSelectColumns"
    @onConfirm="handleMenuSelectConfirm"
    @onCancel="handleMenuSelectClose"
  />
</template>

<script lang="tsx" setup>
import { reactive, ref, toRaw } from "vue";
import { MessagePlugin, type FormInstanceFunctions } from "tdesign-vue-next";
import { SearchIcon } from "tdesign-icons-vue-next";
import SelectTable from "@/components/Table/SelectTable/index.vue";

import { http } from "@/utils/fetch";

import { STATUS_DATA } from "@/common/constants";

import { v4 as uuidv4 } from "uuid";

import { useUserStore } from "@/stores/modules/user";

const props = defineProps(["id", "dialogVisible", "mode"]);
const emits = defineEmits(["close"]);

const formInstance = ref<FormInstanceFunctions | null>(null);

const GET_FORM_PATH = "/system/menu/findOne"; // 查询接口
const CREATE_FORM_PATH = "/system/menu/create"; // 创建接口
const UPDATE_FORM_PATH = "/system/menu/update"; // 更新接口

const userStore = useUserStore();

const pageData = reactive<Record<string, any>>({
  readOnly: false,
  formData: {
    id: "",
    createdTime: "",
    updatedTime: "",
    createdBy: "",
    updatedBy: "",
    remark: "",
    name: "",
    code: "",
    pcIcon: "",
    mobileIcon: "",
    sort: 0,
    status: "1",
    parentId: "",
    parentName: "",
    pcRoute: "",
    mobileRoute: "",
    roleIds: []
  },
  showMenuSelect: false,
  menuSelectData: [],
  menuSelectRow: {},
  menuSelectColumns: [
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
      colKey: "statusLabel",
      title: "状态"
    }
  ],
  roleSelectData: [],
  formRules: {
    name: [
      {
        required: true,
        message: "请输入菜单名称",
        type: "error",
        trigger: "blur"
      }
    ],
    code: [
      {
        required: true,
        message: "请输入菜单代号",
        type: "error",
        trigger: "blur"
      }
    ]
  }
});

/**
 * 初始化表单数据。
 * 根据不同的操作模式（新增、编辑、查看），加载不同的数据。
 * @param id - ID，用于编辑和查看模式下查询信息。
 */
const initFormData = async (id = "") => {
  if (props.mode === "new") {
    // 新增模式下，初始化表单ID和创建时间
    pageData.formData.id = uuidv4();
    pageData.formData.createdBy = userStore.userData?.id;
    pageData.formData.createdTime = new Date().toISOString();
  } else if (props.mode === "edit" || props.mode === "view") {
    // 编辑或查看模式下，根据ID查询用户信息
    const resultData = await http(
      "GET",
      `${GET_FORM_PATH}?id=${encodeURIComponent(id)}`
    );
    pageData.formData = resultData.data;
  }
};

/**
 * 初始化选择表格数据。
 * 查询所有角色信息，用于选择下拉框。
 */
const initRoleSelectData = async () => {
  const resultData = await http("POST", "/user/role/findAll", {});
  pageData.roleSelectData = resultData.data;
};

/**
 * 回查菜单列表数据。
 * 查询所有菜单信息，用于选择表格。
 */
const initMenuSelectData = async () => {
  const resultData = await http("GET", "/system/menu/findAll");
  pageData.menuSelectData = resultData.data;
};

/**
 * 对话框确认时候的操作
 * @param e 选中的菜单数据
 */
const handleMenuSelectConfirm = (e: Record<string, any>) => {
  if (props.mode == "view") {
    MessagePlugin.error("查看模式下不能选择数据。");
    return;
  }
  pageData.menuSelectRow = e.options;
  pageData.formData.parentId = e.options.currentRowData.id;
  pageData.formData.parentName = e.options.currentRowData.name;
  pageData.showMenuSelect = false;
};

/**
 * 关闭选择表格。
 */
const handleMenuSelectClose = () => {
  pageData.showMenuSelect = false;
};

/**
 * 提交表单。
 * 根据不同的操作模式（新增、编辑），调用不同的接口保存信息。
 */
const handleSubmit = async () => {
  const validateResult = await formInstance?.value?.validate();
  if (validateResult === true) {
    let resultData;

    if (props.mode === "view") {
      handleClose();
    }

    const postFormData: Record<string, any> = structuredClone(
      toRaw(pageData.formData)
    );

    if (props.mode === "new") {
      // 新增
      resultData = await http("POST", CREATE_FORM_PATH, postFormData);
    } else {
      // 更新
      postFormData.updatedTime = new Date().toISOString();
      postFormData.updatedBy = userStore.userData?.id;

      resultData = await http("POST", UPDATE_FORM_PATH, postFormData);
    }

    // 根据接口返回结果，提示操作成功或失败，并关闭对话框
    if (resultData.status === "success") {
      emits("close", "success");
    }
  }
};

const handleClose = () => {
  // 关闭对话框，并返回取消操作标识
  emits("close", "cancel");
};

// 如果是查看模式，设置表单为只读
if (props.mode == "view") {
  pageData.readOnly = true;
}

// 初始化表单数据，根据传入的 ID
initFormData(props.id);
initRoleSelectData();
initMenuSelectData();
</script>
