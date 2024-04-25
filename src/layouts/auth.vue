<template>
  <div class="auth-container">
    <RouterView />
  </div>
</template>

<style lang="less" scoped>
.auth-container {
  height: 100vh;
  width: 100vw;
  background-image: url("/images/login.jpg");
  background-size: cover; /* 修改为 cover 以适应窗口大小 */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
