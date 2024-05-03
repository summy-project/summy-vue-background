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
      <t-form-item label="用户ID" name="id">
        <t-input v-model="pageData.formData.id" />
      </t-form-item>
      <t-form-item label="用户名" name="userName">
        <t-input v-model="pageData.formData.userName" />
      </t-form-item>
      <t-form-item label="真实姓名" name="realName">
        <t-input v-model="pageData.formData.realName" />
      </t-form-item>
      <t-form-item label="性别" name="gender">
        <t-select v-model="pageData.formData.gender">
          <t-option
            :label="item.label"
            :value="item.value"
            v-for="item in GENDER_DATA"
            :key="item.value"
          />
        </t-select>
      </t-form-item>
      <t-form-item label="出生日期">
        <t-date-picker
          v-model="pageData.formData.birthDay"
          style="width: 100%"
        />
      </t-form-item>
      <t-form-item label="当前密码" name="oldPassword" v-if="mode !== 'new'">
        <t-input type="password" v-model="pageData.formData.oldPassword" />
      </t-form-item>
      <t-form-item label="新密码" name="password">
        <t-input type="password" v-model="pageData.formData.password" />
      </t-form-item>
      <t-form-item label="确认新密码" name="confirmPassword">
        <t-input type="password" v-model="pageData.formData.confirmPassword" />
      </t-form-item>
      <t-form-item label="手机号码" name="phone">
        <t-input v-model="pageData.formData.phone" />
      </t-form-item>
      <t-form-item label="电邮" name="mail">
        <t-input v-model="pageData.formData.mail" />
      </t-form-item>
      <t-form-item label="角色" name="roleIds">
        <t-select v-model="pageData.formData.roleIds" multiple>
          <t-option
            v-for="item in pageData.roleSelectData"
            :key="item"
            :label="`${item.roleName}（${item.id}）`"
            :value="item.id"
          ></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="用户状态" name="status">
        <t-select v-model="pageData.formData.status">
          <t-option
            :label="item.label"
            :value="item.value"
            v-for="item in STATUS_DATA"
            :key="item.value"
          />
        </t-select>
      </t-form-item>
      <t-form-item label="备注" name="remark">
        <t-textarea v-model="pageData.formData.remark" />
      </t-form-item>
    </t-form>
  </t-drawer>
</template>

<script lang="tsx" setup>
import { reactive, ref, toRaw } from "vue";

import { http } from "@/utils/fetch";
import { sha256 } from "@/utils/tools";
import { isArray } from "radash";
import {
  GENDER_DATA,
  LETTER_NUMBER_PASS,
  STATUS_DATA
} from "@/common/constants";
// import { v4 as uuidv4 } from "uuid";

import { useUserStore } from "@/stores/modules/user";

import { MessagePlugin, type FormInstanceFunctions } from "tdesign-vue-next";

const props = defineProps(["id", "dialogVisible", "mode"]);
const emits = defineEmits(["close"]);

const formInstance = ref<FormInstanceFunctions | null>(null);

const GET_FORM_PATH = "/user/findOne"; // 查询接口
const CREATE_FORM_PATH = "/user/create"; // 创建接口
const UPDATE_FORM_PATH = "/user/update"; // 更新接口

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
    userName: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
    phone: "",
    mail: "",
    realName: "",
    gender: "",
    birthDay: "",
    hasDeleted: false,
    status: "1",
    avatarUrl: "",
    roleIds: []
  },
  roleSelectData: [],
  formRules: {
    id: [
      { required: true, message: "请输入 ID。", type: "error", trigger: "blur" }
    ],
    userName: [
      {
        required: true,
        message: "请输入用户名。",
        type: "error",
        trigger: "blur"
      }
    ],
    oldPassword: [
      {
        required: true,
        message: "请输入当前密码。",
        type: "error",
        trigger: "blur"
      }
    ],
    gender: [
      {
        required: true,
        message: "请指定性别。",
        type: "error",
        trigger: "blur"
      }
    ],
    status: [
      {
        required: true,
        message: "请指定性用户状态。",
        type: "error",
        trigger: "blur"
      }
    ]
    // password: [
    //   {
    //     required: true,
    //     message: "请输入密码。",
    //     type: "error",
    //     trigger: "blur"
    //   }
    // ],
    // confirmPassword: [
    //   {
    //     required: true,
    //     message: "请输入密码。",
    //     type: "error",
    //     trigger: "blur"
    //   }
    // ]
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
    // formData.value.id = uuidv4();
    pageData.formData.createdBy = userStore.userData?.id;
    pageData.formData.createdTime = new Date().toISOString();
    pageData.formData.password = "";
  } else if (props.mode === "edit" || props.mode === "view") {
    // 编辑或查看模式下，根据ID查询用户信息
    const resultData = await http(
      "GET",
      `${GET_FORM_PATH}?id=${encodeURIComponent(id)}`
    );
    pageData.formData = resultData.data;
    pageData.formData.password = "";
    pageData.formData.oldPassword = "";
  }
};

/**
 * 初始化选择表格数据。
 * 查询所有角色信息，用于选择表格。
 */
const initRoleSelectData = async () => {
  const resultData = await http("POST", "/user/role/findAll", {});
  pageData.roleSelectData = resultData.data;
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

    const postFormData = structuredClone(toRaw(pageData.formData));

    if (!LETTER_NUMBER_PASS.test(postFormData.password)) {
      MessagePlugin.error("设置的密码至少要包含字母数字！");
      return;
    }

    if (postFormData.id === "") {
      MessagePlugin.error("没有指定用户ID。");
      return;
    }

    if (postFormData.roleIds.length === 0 || !isArray(postFormData.roleIds)) {
      MessagePlugin.error("没有分配角色。");
      return;
    }

    if (!postFormData.roleIds.includes("user")) {
      MessagePlugin.error("至少分配为“常规用户”。");
      return;
    }

    if (postFormData.roleIds.includes("visitor")) {
      MessagePlugin.error("注册用户不能被分配为“游客”。");
      return;
    }

    // 现密码为空，代表用户不准备更改新的密码。
    if (postFormData.password !== "") {
      // 所以，不需要判断密码一致与否。
      if (postFormData.password !== postFormData.confirmPassword) {
        MessagePlugin.warning("两次输入的密码不一致！");
        return;
      }
      // 新密码，加密后保存。
      postFormData.password = await sha256(postFormData.password);
    }

    // 如果不是新建模式，且旧密码非空，则加密旧密码
    if (props.mode !== "new") {
      if (postFormData.oldPassword !== "") {
        postFormData.oldPassword = await sha256(postFormData.oldPassword);
      }
    }

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

// 初始化表单数据，根据传入的用户ID
initFormData(props.id);
initRoleSelectData();
</script>
