import CardDetailPage from "../components/CardDetailPage";
import { learningCards } from "../data/learningCards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI工具提效指南与避坑指南",
  description: "实测前沿 AI 工具与设计网站，记录实际工作流、踩坑经验与使用方法。",
};

export default function ToolsPage() { return <CardDetailPage card={learningCards[1]} />; }
