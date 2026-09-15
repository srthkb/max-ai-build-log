import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { learnCategories } from "../data/learn";

export const metadata: Metadata = {
  title: "LEARN",
  description: "Learn how to build with AI.",
};

export default function LearnPage() {
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

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:pb-20 sm:pt-20 md:px-12 md:pb-24 md:pt-24">
        <section className="border-b border-sky-100/15 pb-10 md:pb-14">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end md:gap-12">
            <div>
              <h1 className="text-[clamp(3.7rem,17vw,8rem)] font-semibold leading-[.8] tracking-[-.08em] text-white">
                LEARN
              </h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-sky-50/70 sm:text-lg">
                Learn how to build with AI.
              </p>
            </div>
            <p className="max-w-xs text-[10px] leading-relaxed tracking-[.15em] text-sky-200/60 md:text-right">
              LEARNING INDEX / KNOWLEDGE SYSTEM / 04 DIRECTIONS
            </p>
          </div>
        </section>

        <section aria-labelledby="learning-index-title" className="mt-3 md:mt-6">
          <div className="flex items-center justify-between border-b border-sky-100/15 py-4 text-[9px] tracking-[.15em] text-sky-200/45 sm:text-[10px]">
            <h2 id="learning-index-title">LEARNING INDEX</h2>
            <span>SELECT A DIRECTION</span>
          </div>

          <div>
            {learnCategories.map((category) => {
              const content = (
                <>
                  <span className="pt-1 text-[10px] tracking-[.18em] text-sky-300 transition-transform duration-200 group-hover:translate-x-0.5">
                    {category.id}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[clamp(1.75rem,6vw,3.75rem)] font-semibold leading-[.9] tracking-[-.06em] text-sky-50 transition-transform duration-200 group-hover:translate-x-1">
                      {category.title}
                    </h3>
                    <p className="cn-subtitle mt-2 text-sky-50/45">
                      {category.translation}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sky-50/65 sm:text-base">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-1 text-right">
                    <span className={`text-[9px] tracking-[.14em] sm:text-[10px] ${category.status === "START HERE" ? "text-sky-200" : "text-sky-50/40"}`}>
                      {category.status}
                    </span>
                    <ArrowUpRight size={16} className="text-sky-100/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </>
              );

              return category.href ? (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-3 border-b border-sky-100/15 py-8 transition-[background-color,border-color] duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.035] sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-6 sm:py-10 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:gap-8 md:py-12"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={category.id}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-3 border-b border-sky-100/15 py-8 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-6 sm:py-10 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:gap-8 md:py-12"
                  aria-disabled="true"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <nav aria-label="Learn navigation" className="mt-16 flex flex-col gap-4 border-t border-sky-100/15 pt-5 text-[10px] tracking-[.14em] sm:flex-row sm:items-center sm:justify-between">
          <Link href="/start-here" className="group inline-flex min-h-11 items-center gap-2 text-sky-50/55 transition-colors hover:text-white">
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            START HERE
          </Link>
          <Link href="/build" className="group inline-flex min-h-11 items-center gap-2 text-sky-50/55 transition-colors hover:text-white">
            BUILD
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </nav>
      </div>
    </main>
  );
}
