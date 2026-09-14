import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MAX — AI Build Log",
    template: "%s | MAX — AI Build Log",
  },
  description: "Max 的 AI 学习档案：记录 AI 趋势、工具实测、零代码建站与未来洞察。",
  keywords: ["AI 学习", "AI 工具", "AI 趋势", "零代码建站", "AI 原生", "Max AI Build Log"],
  alternates: { canonical: "/" },
  authors: [{ name: "Max" }],
  creator: "Max",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "MAX — AI Build Log",
    title: "MAX — AI Build Log",
    description: "记录 AI 学习、实验与可落地数字作品的个人档案。",
  },
  twitter: {
    card: "summary",
    title: "MAX — AI Build Log",
    description: "记录 AI 学习、实验与可落地数字作品的个人档案。",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
