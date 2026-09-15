import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { learnLessons } from "../../data/learn";

export const metadata: Metadata = {
  title: "CODEX BASICS",
  description: "Start building with AI-assisted coding.",
};

export default function CodexBasicsPage() {
  return (
    <main className="site-space min-h-[100svh] overflow-x-clip text-sky-50">
      <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-12">
        <Link href="/" className="text-xl font-semibold tracking-[-0.08em] text-white">
          MAX<span className="ml-0.5 align-top text-[8px] text-sky-300">®</span>
        </Link>
        <Link
          href="/learn"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-sky-100/20 px-4 text-[10px] font-medium tracking-[.14em] text-sky-50/75 transition-colors duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.06] hover:text-white"
        >
          <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          LEARN
        </Link>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:pb-20 sm:pt-20 md:px-12 md:pb-24 md:pt-24">
        <section className="border-b border-sky-100/15 pb-10 md:pb-14">
          <p className="mb-6 text-[10px] tracking-[.18em] text-sky-300">01 / CODEX BASICS</p>
          <h1 className="max-w-4xl text-[clamp(3rem,12vw,7rem)] font-semibold leading-[.84] tracking-[-.075em] text-white">
            CODEX BASICS
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-sky-50/50">Codex 基础入门</p>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-sky-50/70 sm:text-lg">
            Start building with AI-assisted coding.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-sky-50/45 sm:text-sm">从 AI 辅助编程开始构建。</p>
        </section>

        <section aria-labelledby="lesson-index-title" className="mt-3 md:mt-6">
          <div className="flex items-center justify-between border-b border-sky-100/15 py-4 text-[9px] tracking-[.15em] text-sky-200/45 sm:text-[10px]">
            <h2 id="lesson-index-title">LESSON INDEX</h2>
            <span>05 CHAPTERS / FREE</span>
          </div>

          <div>
            {learnLessons.map((lesson) => (
              <Link key={lesson.id} href={lesson.href} className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-3 border-b border-sky-100/15 py-7 transition-[background-color,border-color] duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.035] sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-6 sm:py-9 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:gap-8 md:py-10">
                <span className="pt-1 text-[10px] tracking-[.18em] text-sky-300">{lesson.id}</span>
                <div className="min-w-0">
                  <h3 className="text-[clamp(1.35rem,4vw,2.5rem)] font-semibold leading-[.95] tracking-[-.045em] text-sky-50 transition-transform duration-200 group-hover:translate-x-1">
                    {lesson.title}
                  </h3>
                  <p className="cn-subtitle mt-2 text-sky-50/45">{lesson.translation}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sky-50/60 sm:text-base">
                    {lesson.description}
                  </p>
                </div>
                <span className="flex items-start gap-3 pt-1 text-[9px] tracking-[.14em] text-sky-200/70 sm:text-[10px]">
                  {lesson.status}
                  <ArrowRight size={14} className="text-sky-100/55 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <nav aria-label="Codex basics navigation" className="mt-16 flex flex-col gap-4 border-t border-sky-100/15 pt-5 text-[10px] tracking-[.14em] sm:flex-row sm:items-center sm:justify-between">
          <Link href="/learn" className="group inline-flex min-h-11 items-center gap-2 text-sky-50/55 transition-colors hover:text-white">
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            LEARN INDEX
          </Link>
          <Link href="/start-here" className="group inline-flex min-h-11 items-center gap-2 text-sky-50/55 transition-colors hover:text-white">
            START HERE
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </nav>
      </div>
    </main>
  );
}
