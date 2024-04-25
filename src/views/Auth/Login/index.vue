<template>
  <div class="auth-form-container">
    <div class="auth-form-container-title">欢迎使用，请登录。</div>
    <t-form
      ref="formInstance"
      :data="pageData.formData"
      :rules="pageData.formRules"
      :colon="false"
      :label-width="0"
    >
      <t-form-item name="userId">
        <t-input
          v-model="pageData.formData.userId"
          clearable
          placeholder="请输入用户 ID"
        />
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="pageData.formData.password"
          type="password"
          clearable
          placeholder="请输入密码"
        />
      </t-form-item>

      <t-form-item>
        <t-checkbox v-model="pageData.rememberMe">记住我</t-checkbox>
      </t-form-item>

      <t-form-item>
        <t-button theme="primary" type="submit" @click="handleSubmit" block
          >登录</t-button
        >
      </t-form-item>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw } from "vue";
import { NotifyPlugin, type FormInstanceFunctions } from "tdesign-vue-next";
import { useRouter } from "vue-router";

import { http } from "@/utils/fetch";
import { sha256 } from "@/utils/tools";

import { useUserStore } from "@/stores/modules/user";

const router = useRouter();
const userStore = useUserStore();

const formInstance = ref<FormInstanceFunctions | null>(null);

const pageData = reactive<Record<string, any>>({
  rememberMe: false,
  formData: {
    userId: "",
    password: ""
  },
  formRules: {
    userId: [
      { required: true, message: "请输入 ID。", type: "error", trigger: "blur" }
    ],
    password: [
      {
        required: true,
        message: "请输入密码。",
        type: "error",
        trigger: "blur"
      }
    ]
  }
});

const handleSubmit = async () => {
  const validateResult = await formInstance?.value?.validate();
  if (validateResult === true) {
    const postFormData = structuredClone(toRaw(pageData.formData));
    if (postFormData.userId === "visitor") {
      NotifyPlugin.success({
        title: "错误",
        content: "不允许以游客身份登录！"
      });
      return;
    }
    postFormData.password = await sha256(postFormData.password);

    const resultData = await http("POST", "/auth/login", postFormData);

    if (resultData.status === "success") {
      // 将登陆信息存储到 Pinia Store 里面
      userStore.setUserData(resultData.data.userData);

      if (pageData.rememberMe) {
        window.localStorage.setItem("userAuthToken", resultData.data.token);
      } else {
        window.sessionStorage.setItem("userAuthToken", resultData.data.token);
      }

      await NotifyPlugin.success({ title: "成功", content: "登录成功！" });
      router.push("/dashboard");
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>
