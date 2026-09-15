"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type ToolItem = {
  id: string;
  title: string;
  translation: string;
  description: string;
  useFor: string;
  href: string;
};

type ToolGroup = {
  title: string;
  translation: string;
  items: ToolItem[];
};

type SkillItem = {
  id: string;
  title: string;
  translation: string;
  description: string;
  useFor: string;
  href?: string;
};

const toolGroups: ToolGroup[] = [
  {
    title: "DESIGN & INSPIRATION",
    translation: "设计与灵感网站",
    items: [
      {
        id: "01",
        title: "BENTO GRIDS",
        translation: "苹果风网格灵感",
        description: "收集 Bento Grid / 网格布局案例，用来寻找网页首页、Portfolio、产品介绍的版式灵感。",
        useFor: "网页布局 / 首页设计 / Portfolio / Bento Grid",
        href: "https://bentogrids.com/",
      },
      {
        id: "02",
        title: "21ST.DEV",
        translation: "React 组件与 AI UI 素材",
        description: "React / Tailwind 组件和页面区块资源，可以参考、复制组件代码或 AI Prompt 给 Codex 使用。",
        useFor: "React / UI 组件 / Landing Page / AI 建站 / 快速原型",
        href: "https://21st.dev/",
      },
      {
        id: "03",
        title: "MADE WITH GSAP",
        translation: "高级网页动效案例",
        description: "真实网页 GSAP 动效案例，用来寻找滚动、鼠标交互、拖拽、转场等动效灵感。",
        useFor: "Creative Website / Scroll Animation / Mouse Interaction / GSAP",
        href: "https://madewithgsap.com/",
      },
    ],
  },
  {
    title: "MOTION & EFFECTS",
    translation: "动效与视觉效果网站",
    items: [
      {
        id: "04",
        title: "SHADER GRADIENT",
        translation: "动态渐变生成器",
        description: "生成动态 Shader / Gradient 背景，可以调整颜色、运动和视觉效果。",
        useFor: "Hero 背景 / 科技感网页 / AI 网站 / 动态背景",
        href: "https://shadergradient.co/",
      },
      {
        id: "05",
        title: "REACT BITS",
        translation: "React 开源动效组件库",
        description: "React 开源视觉组件和动效集合，包含文字动画、背景、交互和滚动效果。",
        useFor: "React / 文字动画 / 背景效果 / Hover Interaction",
        href: "https://www.reactbits.dev/",
      },
      {
        id: "06",
        title: "MOTION PROMPTS",
        translation: "网页动效 Prompt 库",
        description: "提供网页动效 Prompt 和 Demo，可以参考效果后交给 Codex 等 AI 编程工具实现。",
        useFor: "AI 建站 / GSAP / Scroll Animation / WebGL / 网页交互",
        href: "https://motionprompts.dev/",
      },
    ],
  },
];

const skills: SkillItem[] = [
  {
    id: "01",
    title: "FRONTEND DESIGN",
    translation: "让 AI 做出更有设计感的网站",
    description: "帮助 AI 在生成网页时更关注视觉设计、排版、布局和整体体验，减少模板化的网站效果。",
    useFor: "网页设计 / Landing Page / Portfolio / 首页设计",
  },
  {
    id: "02",
    title: "WEB DESIGN GUIDELINES",
    translation: "检查网页设计与体验问题",
    description: "帮助 AI 从网页规范、可访问性、交互、响应式和视觉细节等方面检查网站。",
    useFor: "网站优化 / UI Review / Accessibility / Responsive",
  },
  {
    id: "03",
    title: "IMPECCABLE",
    translation: "帮助 AI 减少“AI 味”",
    description: "帮助发现和改善 AI 生成网页中常见的模板化、粗糙和缺乏设计感的问题。",
    useFor: "AI 网站优化 / UI Polish / Redesign / 去 AI 味",
  },
  {
    id: "04",
    title: "DESIGN TASTE",
    translation: "让 AI 少一点模板感",
    description: "帮助 AI 在网页设计中建立更明确的视觉方向和设计判断，减少千篇一律的 AI 页面。",
    useFor: "高级网页 / 极简设计 / Editorial / Portfolio",
  },
  {
    id: "05",
    title: "UI / UX PRO MAX",
    translation: "提升 UI 与用户体验",
    description: "从 UI、UX、交互、导航、表单、动画和可访问性等方面帮助 AI 完善网站。",
    useFor: "产品网站 / Web App / Dashboard / UI 优化",
  },
  {
    id: "06",
    title: "IMAGE TO CODE",
    translation: "把参考图变成网页",
    description: "根据设计图、截图或视觉参考，帮助 AI 分析页面结构并转化成网页代码。",
    useFor: "设计稿还原 / Screenshot to Code / 网页复刻 / AI 建站",
  },
  {
    id: "07",
    title: "BROWSER USE",
    translation: "让 AI 操作浏览器",
    description: "让 AI 不只是修改代码，还可以通过浏览器进行实际操作、检查网页和测试用户流程。",
    useFor: "网页测试 / 自动化 / Browser Agent / 产品验证",
  },
  {
    id: "08",
    title: "QA",
    translation: "让 AI 自动检查网站",
    description: "帮助 AI 像测试人员一样检查网页，发现布局、交互、响应式和功能方面的问题。",
    useFor: "上线前检查 / Bug 检查 / Responsive QA / 网站测试",
  },
  {
    id: "09",
    title: "REACT BEST PRACTICES",
    translation: "提升 React 项目质量",
    description: "帮助 AI 在 React / Next.js 项目中遵循更好的代码结构、性能和开发实践。",
    useFor: "React / Next.js / 网站优化 / 性能优化",
  },
  {
    id: "10",
    title: "WEB INTERFACE GUIDELINES",
    translation: "按照网页规范检查 UI",
    description: "从 Typography、Forms、Animation、Navigation、Accessibility、Images 等方面检查网页界面。",
    useFor: "UI Review / 网页规范 / 细节优化 / 上线前检查",
  },
];

export default function ToolsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(id: string, text: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      setCopiedId(id);
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <main className="site-space min-h-[100svh] overflow-x-clip text-sky-50">
      <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-12">
        <Link href="/" className="text-xl font-semibold tracking-[-0.08em] text-white">
          MAX<span className="ml-0.5 align-top text-[8px] text-sky-300">®</span>
        </Link>
        <Link
          href="/start-here"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-sky-100/20 px-4 text-[10px] font-medium tracking-[.14em] text-sky-50/75 transition-colors duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.06] hover:text-white"
        >
          <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          BACK
        </Link>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:pb-24 sm:pt-20 md:px-12 md:pb-28 md:pt-24">
        <section className="border-b border-sky-100/15 pb-10 md:pb-14">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end md:gap-12">
            <div>
              <h1 className="text-[clamp(3.7rem,17vw,8rem)] font-semibold leading-[.8] tracking-[-.08em] text-white">
                TOOLS
              </h1>
              <p className="cn-subtitle mt-5 leading-relaxed text-sky-50/60">AI 建站工具箱，可直接复制给 Codex、Claude 等 AI 编程工具，精选免费实用的高星网站与 Skills。</p>
            </div>
            <p className="max-w-xs text-[10px] leading-relaxed tracking-[.15em] text-sky-200/60 md:text-right">
              AI BUILDER TOOLBOX / REFERENCES / 06 TOOLS
            </p>
          </div>
        </section>

        <section aria-labelledby="tools-index-title" className="mt-14 md:mt-20">
          <div className="flex items-center justify-between border-b border-sky-100/15 pb-4 text-[10px] tracking-[.16em] text-sky-200/55">
            <h2 id="tools-index-title">TOOLS</h2>
            <span>MY AI BUILDING TOOLBOX</span>
          </div>

          {toolGroups.map((group) => (
            <section key={group.title} aria-labelledby={`${group.title.toLowerCase().replaceAll(" ", "-")}-title`} className="mt-12 md:mt-16">
              <div className="flex flex-col items-start gap-2 border-b border-sky-100/10 pb-5">
                <h3 id={`${group.title.toLowerCase().replaceAll(" ", "-")}-title`} className="text-sm font-medium tracking-[.16em] text-sky-100 sm:text-base">
                  {group.title}
                </h3>
                <p className="cn-subtitle text-sky-50/55">{group.translation}</p>
              </div>

              <div>
                {group.items.map((tool) => (
                  <div
                    key={tool.id}
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-3 border-b border-sky-100/15 py-8 transition-[background-color,border-color] duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.035] sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-6 sm:py-10 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:gap-8 md:py-12"
                  >
                    <span className="pt-1 text-[10px] tracking-[.18em] text-sky-300 transition-transform duration-200 group-hover:translate-x-0.5">{tool.id}</span>
                    <a href={tool.href} target="_blank" rel="noreferrer" className="min-w-0">
                      <h4 className="text-[clamp(1.65rem,5vw,3.5rem)] font-semibold leading-[.9] tracking-[-.06em] text-sky-50 transition-transform duration-200 group-hover:translate-x-1">
                        {tool.title}
                      </h4>
                      <p className="cn-subtitle mt-2 text-sky-50/55">{tool.translation}</p>
                      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-sky-50/65 sm:text-base">{tool.description}</p>
                      <p className="mt-4 max-w-3xl text-[9px] leading-relaxed tracking-[.1em] text-sky-200/50 sm:text-[10px] sm:tracking-[.13em]">适用 / {tool.useFor}</p>
                    </a>
                    <div className="flex min-w-[4.5rem] flex-col items-end gap-2 pt-0.5 text-[9px] tracking-[.14em] sm:min-w-[5.5rem] sm:text-[10px]">
                      <button type="button" onClick={() => handleCopy(`tool-${tool.id}`, tool.href)} className="inline-flex min-h-11 items-center border border-sky-100/20 px-2.5 text-sky-100/65 transition-[background-color,border-color,color] duration-200 hover:border-sky-100/60 hover:bg-sky-100/[.06] hover:text-white" aria-label={`复制 ${tool.title} 网站地址`}>
                        {copiedId === `tool-${tool.id}` ? "✓ COPIED" : "COPY"}
                      </button>
                      <a href={tool.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sky-100/70 transition-colors hover:text-white">
                        VISIT
                        <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section aria-labelledby="skills-index-title" className="mt-20 md:mt-28">
          <div className="flex flex-col gap-2 border-b border-sky-100/15 pb-5 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 id="skills-index-title" className="text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[.85] tracking-[-.07em] text-white">SKILLS</h2>
              <p className="cn-subtitle mt-3 text-sky-50/55">让 Codex 按我的方法工作</p>
            </div>
            <span className="text-[10px] tracking-[.16em] text-sky-200/55">METHODS / 10 SKILLS</span>
          </div>

          <div>
            {skills.map((skill) => (
              <div key={skill.id} className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-3 border-b border-sky-100/15 py-7 transition-[background-color,border-color] duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.035] sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-6 sm:py-8 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:gap-8 md:py-9">
                <span className="pt-1 text-[10px] tracking-[.18em] text-sky-300 transition-transform duration-200 group-hover:translate-x-0.5">{skill.id}</span>
                <div className="min-w-0">
                  <h3 className="text-[clamp(1.35rem,4vw,2.5rem)] font-semibold leading-[.95] tracking-[-.045em] text-sky-50 transition-transform duration-200 group-hover:translate-x-1">{skill.title}</h3>
                  <p className="cn-subtitle mt-2 text-sky-50/55">{skill.translation}</p>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-sky-50/65 sm:text-base">{skill.description}</p>
                  <p className="mt-4 max-w-3xl text-[9px] leading-relaxed tracking-[.1em] text-sky-200/50 sm:text-[10px] sm:tracking-[.13em]">适用 / {skill.useFor}</p>
                </div>
                <div className="flex min-w-[4.5rem] flex-col items-end gap-2 pt-0.5 text-[9px] tracking-[.14em] sm:min-w-[5.5rem] sm:text-[10px]">
                  <button type="button" onClick={() => handleCopy(`skill-${skill.id}`, skill.href ? `${skill.title}\n${skill.href}` : skill.title)} className="inline-flex min-h-11 items-center border border-sky-100/20 px-2.5 text-sky-100/65 transition-[background-color,border-color,color] duration-200 hover:border-sky-100/60 hover:bg-sky-100/[.06] hover:text-white" aria-label={`复制 ${skill.title} 使用信息`}>
                    {copiedId === `skill-${skill.id}` ? "✓ COPIED" : "COPY"}
                  </button>
                  {skill.href ? (
                    <a href={skill.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sky-100/70 transition-colors hover:text-white">
                      VIEW SKILL
                      <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center text-sky-50/40">SKILL</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <nav aria-label="Tools navigation" className="mt-16 flex border-t border-sky-100/15 pt-5 text-[10px] tracking-[.14em]">
          <Link href="/start-here" className="group inline-flex min-h-11 items-center gap-2 text-sky-50/55 transition-colors hover:text-white">
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            START HERE
          </Link>
        </nav>
      </div>
    </main>
  );
}
