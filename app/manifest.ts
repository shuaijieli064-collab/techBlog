import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Nexus",
    description: "记录软件工程学习、项目实践和成长复盘的个人技术博客与开发者工作台。",
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#5ce1ff",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    categories: ["developer", "education", "productivity"],
    lang: "zh-CN",
    dir: "ltr",
  };
}