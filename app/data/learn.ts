export type LearnCategory = {
  id: string;
  title: string;
  translation: string;
  description: string;
  status: "START HERE" | "COMING SOON";
  slug: string;
  href?: string;
};

export type LearnLesson = {
  id: string;
  title: string;
  translation: string;
  description: string;
  status: "FREE";
  slug: string;
  href: string;
};

export const learnCategories: LearnCategory[] = [
  {
    id: "01",
    title: "CODEX BASICS",
    translation: "Codex 基础入门",
    description: "Learn the fundamentals of building with Codex.",
    status: "START HERE",
    slug: "codex-basics",
    href: "/learn/codex-basics",
  },
  {
    id: "02",
    title: "BUILD WITH AI",
    translation: "使用 AI 开始构建",
    description: "From an idea to a real website.",
    status: "COMING SOON",
    slug: "build-with-ai",
  },
  {
    id: "03",
    title: "AI WORKFLOW",
    translation: "AI 工作流",
    description: "Learn how to combine AI tools to get real work done.",
    status: "COMING SOON",
    slug: "ai-workflow",
  },
  {
    id: "04",
    title: "BEGINNER GUIDE",
    translation: "新手入门指南",
    description: "Everything you need to know before you start building with AI.",
    status: "COMING SOON",
    slug: "beginner-guide",
  },
];

export const learnLessons: LearnLesson[] = [
  {
    id: "01",
    title: "WHAT IS CODEX?",
    translation: "什么是 Codex？",
    description: "Understand the AI coding partner you are about to work with.",
    status: "FREE",
    slug: "what-is-codex",
    href: "/learn/codex-basics/what-is-codex",
  },
  {
    id: "02",
    title: "HOW TO TALK TO CODEX",
    translation: "如何与 Codex 沟通",
    description: "Learn how to give context, constraints, and feedback.",
    status: "FREE",
    slug: "how-to-talk-to-codex",
    href: "/learn/codex-basics/how-to-talk-to-codex",
  },
  {
    id: "03",
    title: "DEBUGGING WITH CODEX",
    translation: "使用 Codex 调试",
    description: "Use evidence and iteration to find what is actually broken.",
    status: "FREE",
    slug: "debugging-with-codex",
    href: "/learn/codex-basics/debugging-with-codex",
  },
];
