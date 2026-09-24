import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "陈宇航 DOUYOU — AI 设计师作品集",
  description:
    "陈宇航的 AI 设计作品集，涵盖电商主图、详情页、直播间搭建、运营长图、IP 设计与 AI 导演视频制作。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
