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
      <t-form-item label="邀请码" name="id">
        <t-input v-model="pageData.formData.id" disabled />
      </t-form-item>
      <t-form-item label="使用人" name="usedUserId">
        <t-input v-model="pageData.formData.usedUserId" disabled />
      </t-form-item>
      <t-form-item label="备注" name="remark">
        <t-textarea v-model="pageData.formData.remark" />
      </t-form-item>
    </t-form>
  </t-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw } from "vue";

import { uid } from "radash";
import { http } from "@/utils/fetch";

// import { v4 as uuidv4 } from "uuid";

import { useUserStore } from "@/stores/modules/user";
import type { FormInstanceFunctions } from "tdesign-vue-next";

const props = defineProps(["id", "dialogVisible", "mode"]);
const emits = defineEmits(["close"]);

const formInstance = ref<FormInstanceFunctions | null>(null);

const GET_FORM_PATH = "/user/invite-code/findOne"; // 查询接口
const CREATE_FORM_PATH = "/user/invite-code/create"; // 创建接口
const UPDATE_FORM_PATH = "/user/invite-code/update"; // 更新接口

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
    usedUserId: ""
  },
  formRules: {
    id: [
      {
        required: true,
        message: "请输入邀请码",
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
    pageData.formData.id = uid(8);
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

    if (props.mode == "new") {
      // 新增
      resultData = await http("POST", CREATE_FORM_PATH, postFormData);
    } else {
      // 更新
      pageData.formData.updatedTime = new Date().toISOString();
      pageData.formData.updatedBy = userStore.userData?.id;

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
</script>
