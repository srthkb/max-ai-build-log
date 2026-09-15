import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "START HERE",
  description: "选择学习、实战或工具路径，从这里进入 MAX 的 AI Builder 实验系统。",
};

const paths = [
  {
    number: "01",
    title: "LEARN",
    translation: "学习",
    subtitle: "Learn how to build with AI.",
    detail: "CODEX / PROMPTS / AI WORKFLOWS / STARTING FROM ZERO",
    href: "/learn",
    layout: "lg:mr-[18%]",
  },
  {
    number: "02",
    title: "BUILD",
    translation: "构建",
    subtitle: "Turn ideas into real things.",
    detail: "AI WEBSITES / MVP / BUILD LOG / FROM IDEA TO LAUNCH",
    href: "/build",
    layout: "lg:ml-[9%] lg:mr-[8%]",
  },
  {
    number: "03",
    title: "TOOLS",
    translation: "工具",
    subtitle: "Understand the tools behind the work.",
    detail: "CODEX / CHATGPT / CLAUDE / DESIGN / AUTOMATION",
    href: "/tools",
    layout: "lg:ml-[21%]",
  },
];

export default function StartHerePage() {
  return <main className="site-space min-h-[100svh] overflow-x-clip text-sky-50">
    <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-12">
      <Link href="/" className="text-xl font-semibold tracking-[-0.08em] text-white">MAX<span className="ml-0.5 align-top text-[8px] text-sky-300">®</span></Link>
      <Link href="/" className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-sky-100/20 px-4 text-[10px] font-medium tracking-[.14em] text-sky-50/75 transition-colors duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.06] hover:text-white"><ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />BACK</Link>
    </header>

    <section className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col px-5 pb-16 pt-14 sm:pb-20 sm:pt-20 md:min-h-[calc(100svh-5rem)] md:px-12 md:pb-24 md:pt-24">
      <div className="flex flex-col justify-between gap-8 border-b border-sky-100/15 pb-10 md:flex-row md:items-end md:gap-12 md:pb-14">
        <div>
          <h1 className="max-w-3xl text-[clamp(3.7rem,17vw,8rem)] font-semibold leading-[.8] tracking-[-.08em] text-white">START<br /><span className="text-sky-200/85">HERE</span></h1>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-sky-50/65 sm:text-lg">Choose where you want to begin.</p>
        </div>
        <p className="max-w-xs text-[10px] leading-relaxed tracking-[.15em] text-sky-200/60 md:text-right">SYSTEM ENTRY / THREE PATHS / ONE NEXT STEP</p>
      </div>

      <nav aria-label="Start paths" className="mt-3 flex flex-1 flex-col justify-center md:mt-6">
        {paths.map((path) => <Link key={path.number} href={path.href} className={`group relative block border-t border-sky-100/15 py-8 transition-[background-color,border-color] duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.035] sm:py-10 md:py-12 ${path.layout}`}>
          <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-start gap-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-6 md:gap-8">
            <span className="pt-2 text-[10px] tracking-[.18em] text-sky-300">{path.number}</span>
            <div className="min-w-0">
              <h2 className="text-[clamp(2.25rem,11vw,5.5rem)] font-semibold leading-[.86] tracking-[-.07em] text-sky-50 transition-transform duration-200 group-hover:translate-x-1">{path.title}</h2>
              <p className="cn-subtitle mt-2 text-sky-50/55">{path.translation}</p>
              <p className="mt-3 text-base leading-relaxed text-sky-50/70 sm:mt-4 sm:text-lg">{path.subtitle}</p>
              <p className="mt-5 max-w-xl text-[9px] leading-relaxed tracking-[.12em] text-sky-200/55 sm:text-[10px] sm:tracking-[.15em]">{path.detail}</p>
            </div>
            <span className="mt-2 grid h-11 w-11 place-items-center rounded-full border border-sky-100/25 text-sky-100/70 transition-[color,background-color,border-color,transform] duration-200 group-hover:translate-x-1 group-hover:border-sky-100 group-hover:bg-sky-100 group-hover:text-[#06204a]"><ArrowUpRight size={17} /></span>
          </div>
        </Link>)}
      </nav>

      <div className="mt-6 flex flex-col gap-2 border-t border-sky-100/15 pt-5 text-[9px] tracking-[.14em] text-sky-50/40 sm:flex-row sm:justify-between sm:text-[10px]">
        <span>MAX / AI BUILDER EXPERIMENT SYSTEM</span>
        <span>SELECT A PATH TO CONTINUE</span>
      </div>
    </section>
  </main>;
}
