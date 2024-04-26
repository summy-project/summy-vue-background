<template>
  <div class="auth-form-container">
    <div class="auth-form-container-title">欢迎使用，请注册。</div>
    <t-form
      ref="formInstance"
      :data="pageData.formData"
      :rules="pageData.formRules"
      :colon="false"
    >
      <t-form-item name="id" label="用户ID">
        <t-input v-model="pageData.formData.id" clearable> </t-input>
      </t-form-item>

      <t-form-item name="userName" label="用户名">
        <t-input v-model="pageData.formData.userName" clearable> </t-input>
      </t-form-item>

      <t-form-item name="password" label="密码">
        <t-input v-model="pageData.formData.password" type="password" clearable>
        </t-input>
      </t-form-item>

      <t-form-item name="confirmPassword" label="确认密码">
        <t-input
          v-model="pageData.formData.confirmPassword"
          type="password"
          clearable
        >
        </t-input>
      </t-form-item>

      <t-form-item name="realName" label="真实姓名">
        <t-input v-model="pageData.formData.realName" clearable> </t-input>
      </t-form-item>

      <t-form-item name="gender" label="性别">
        <t-select v-model="pageData.formData.gender">
          <t-option
            :label="item.label"
            :value="item.value"
            v-for="item in GENDER_DATA"
            :key="item.value"
          />
        </t-select>
      </t-form-item>

      <t-form-item name="phone" label="手机号">
        <t-input v-model="pageData.formData.phone" clearable> </t-input>
      </t-form-item>

      <t-form-item name="mail" label="电邮">
        <t-input v-model="pageData.formData.mail" clearable> </t-input>
      </t-form-item>

      <t-form-item name="inviteCode" label="邀请码">
        <t-input v-model="pageData.formData.inviteCode" clearable> </t-input>
      </t-form-item>

      <t-form-item>
        <t-button theme="primary" type="submit" @click="handleSubmit" block
          >注册</t-button
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
import { GENDER_DATA } from "@/common/constants";

const router = useRouter();
const formInstance = ref<FormInstanceFunctions | null>(null);

const pageData = reactive<Record<string, any>>({
  formData: {
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
    roleIds: ["user"],
    inviteCode: ""
  },
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
  pageData.formData.createdTime = new Date().toISOString();
};

const handleSubmit: FormProps["onSubmit"] = async () => {
  const validateResult = await formInstance?.value?.validate();
  if (validateResult === true) {
    const postFormData = structuredClone(toRaw(pageData.formData));

    if (postFormData.password !== postFormData.confirmPassword) {
      MessagePlugin.warning("两次输入的密码不一致！");
      return;
    }

    postFormData.password = await sha256(postFormData.password);

    const resultData = await http("POST", "/auth/signup", postFormData);

    if (resultData.status === "success") {
      MessagePlugin.success("注册成功!");
      router.push("/auth/login");
    }
  }
};

initFormData();
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>
