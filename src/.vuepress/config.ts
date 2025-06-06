import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/coder-notes/",

  lang: "zh-CN",
  title: "面试笔记",
  description: "编程的一些知识和经验，希望对个人学习，工作和求职有所帮助。",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
