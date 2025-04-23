import { sidebar } from "vuepress-theme-hope";

export default sidebar({

  "/notes/":[
    {
      text: "知识点",
      icon: "icomoon-free:books",
      children: "structure",
    }
  ]
});
