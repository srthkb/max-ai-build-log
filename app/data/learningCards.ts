export type LearningCard = {
  id: string;
  number: string;
  title: string;
  cardTitle?: string;
  status: string;
  summary: string;
  placeholder: string;
  href: "/research" | "/tools" | "/awakening" | "/insights";
};

export const learningCards: LearningCard[] = [
  {
    id: "ai-awakening",
    number: "01",
    title: "非程序员的AI觉醒日志",
    cardTitle: "开发人感想-Max",
    status: "BUILDING",
    summary: "不懂代码，也能在1天内做出带3D特效的网页？记录一个普通人借助AI实现生产力跃迁的真实过程。",
    placeholder: "记录今天的突破、卡点与真实进展…",
    href: "/awakening",
  },
  {
    id: "ai-tools",
    number: "02",
    title: "AI工具提效指南与避坑指南",
    status: "TOOLS",
    summary: "实测20+前沿AI工具与设计网站（React Bits等），记录我折腾Codex、Sol和Kimi的踩坑与神仙用法。",
    placeholder: "记录工具测试、工作流与避坑经验…",
    href: "/tools",
  },
  {
    id: "ai-architecture",
    number: "03",
    title: "AI趋势与企业架构重塑",
    status: "RESEARCH",
    summary: "商业从技术演进到商业落地，拆解未来5年企业如何拥抱AI原生架构。0代码基础的我，如何逻辑？",
    placeholder: "记录 AI 原生架构、企业案例与自己的思考…",
    href: "/research",
  },
  {
    id: "ai-insights",
    number: "04",
    title: "前沿AI研究报告与未来洞察",
    status: "INSIGHTS",
    summary: "不贩卖焦虑，只提供深度思考。定期更新AI行业分析、技术走向预测与个人应对策略。",
    placeholder: "沉淀研究、判断与下一步行动…",
    href: "/insights",
  },
];
