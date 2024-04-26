<template>
  <div class="auth-form-container">
    <div class="auth-form-container-title">
      现在，请设置您的超级管理员账户。
    </div>
    <t-form
      ref="formInstance"
      :data="pageData.userData"
      :rules="pageData.formRules"
      :colon="false"
    >
      <t-form-item name="id" label="用户 ID">
        <t-input v-model="pageData.userData.id" clearable> </t-input>
      </t-form-item>

      <t-form-item name="userName" label="用户名">
        <t-input v-model="pageData.userData.userName" clearable> </t-input>
      </t-form-item>

      <t-form-item name="realName" label="真实姓名">
        <t-input v-model="pageData.userData.realName" clearable> </t-input>
      </t-form-item>

      <t-form-item name="password" label="密码">
        <t-input v-model="pageData.userData.password" type="password" clearable>
        </t-input>
      </t-form-item>

      <t-form-item name="confirmPassword" label="确认密码">
        <t-input
          v-model="pageData.userData.confirmPassword"
          type="password"
          clearable
        >
        </t-input>
      </t-form-item>

      <t-form-item>
        <t-button theme="primary" type="submit" @click="handleSubmit" block
          >初始化</t-button
        >
      </t-form-item>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import {
  MessagePlugin,
  type FormInstanceFunctions,
  type FormProps
} from "tdesign-vue-next";

import { http } from "@/utils/fetch";
import { sha256 } from "@/utils/tools";

const router = useRouter();

const formInstance = ref<FormInstanceFunctions | null>(null);

const pageData = reactive<Record<string, any>>({
  userData: {
    id: "",
    createdTime: "",
    updatedTime: "",
    createdBy: "",
    updatedBy: "",
    remark: "",
    userName: "",
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
    roleIds: ["user", "root"],
    inviteCode: ""
  },
  visitorData: {
    id: "visitor",
    createdTime: "",
    updatedTime: "",
    createdBy: "",
    updatedBy: "",
    remark: "",
    userName: "游客",
    password: "visitor",
    confirmPassword: "visitor",
    phone: "",
    mail: "",
    realName: "",
    gender: "",
    birthDay: "",
    hasDeleted: false,
    status: "1",
    avatarUrl: "",
    roleIds: ["visitor"],
    inviteCode: ""
  },
  roles: [
    {
      id: "root",
      createdTime: "",
      updatedTime: "",
      createdBy: "",
      updatedBy: "",
      remark: "",
      roleName: "超级管理员",
      codeType: "root"
    },
    {
      id: "admin",
      createdTime: "",
      updatedTime: "",
      createdBy: "",
      updatedBy: "",
      remark: "",
      roleName: "常规管理员",
      codeType: "admin"
    },
    {
      id: "user",
      createdTime: "",
      updatedTime: "",
      createdBy: "",
      updatedBy: "",
      remark: "",
      roleName: "常规用户",
      codeType: "user"
    },
    {
      id: "visitor",
      createdTime: "",
      updatedTime: "",
      createdBy: "",
      updatedBy: "",
      remark: "",
      roleName: "游客",
      codeType: "visitor"
    }
  ],
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
    password: [
      {
        required: true,
        message: "请输入密码。",
        type: "error",
        trigger: "blur"
      }
    ],
    confirmPassword: [
      {
        required: true,
        message: "请输入密码。",
        type: "error",
        trigger: "blur"
      }
    ]
  }
});

const initFormData = async () => {
  pageData.userData.createdTime = new Date().toISOString();
  pageData.visitorData.createdTime = new Date().toISOString();
};

const handleSubmit: FormProps["onSubmit"] = async () => {
  const validateResult = await formInstance?.value?.validate();

  if (validateResult) {
    const postFormData = structuredClone(toRaw(pageData));

    if (
      postFormData.userData.password !== postFormData.userData.confirmPassword
    ) {
      MessagePlugin.error("两次输入的密码不一致！");
      return;
    }

    postFormData.userData.password = await sha256(
      postFormData.userData.password
    );

    postFormData.roles = postFormData.roles.map((item: Record<string, any>) => {
      item.createdTime = new Date().toISOString();
      item.createdBy = postFormData.userData.id;
      return item;
    });

    const resultData = await http("POST", "/auth/setupProject", postFormData);
    if (resultData.data.status === "success") {
      MessagePlugin.success("初始化成功！");
      router.push("/auth/login");
    }
  }
};

initFormData();
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>
