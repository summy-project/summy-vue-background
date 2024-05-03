# 前端（后台管理）

基于 Vue3 + TypeScript 的后台管理系统。使用 TDesign 组件库构建用户界面。

- 基于 Vue 3.4，Vue 3.4 带来了很多新特性和新的语法糖，更加方便前端程序员开发项目。
- 使用 Radash 作为工具库（后端也使用），Radash 是 Lodash 的良好替代品，采用 TypeScript 编写，支持 ES6+ 特性，更加现代。
- 使用 `fetch()` API 而不是传统前端项目所使用的 `Axios`，`fetch()` 是浏览器原生 API，更加轻量，性能上也更占优势。

## 安装

项目使用 `pnpm` 作为包管理器。

## 开发配置

1. 按照后端的说明文档配置好后端（summy-backend），并且要允许初始化；
2. 将 `vite.config.ts` 中的反向代理设置成后端地址。
3. 运行 `pnpm run dev` 命令启动前端的 Vite 开发服务器。
4. 浏览器输入：`http://localhost:5200/auth/setup` 访问初始化页面，进行初始化。

## 版权

前端代码基于 MIT 许可证下发布。

登录页面所用背景图：

- 名称：Felis catus-cat on snow

- 出处：https://commons.wikimedia.org/wiki/File:Felis_catus-cat_on_snow.jpg
- 作者：Von.grzanka
- 授权：CC BY-SA 3.0
