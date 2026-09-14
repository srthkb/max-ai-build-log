import CardDetailPage from "../components/CardDetailPage";
import { learningCards } from "../data/learningCards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "前沿AI研究报告与未来洞察",
  description: "持续更新 AI 行业分析、技术走向预测与个人应对策略。",
};

export default function InsightsPage() { return <CardDetailPage card={learningCards[3]} />; }
