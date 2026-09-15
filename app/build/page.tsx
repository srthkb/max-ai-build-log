import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BUILD",
  description: "Turn ideas into real things.",
};

export default function BuildPage() {
  return <main className="site-space min-h-[100svh] overflow-x-clip px-5 py-8 text-sky-50 md:px-12 md:py-10">
    <div className="mx-auto max-w-7xl">
      <Link href="/start-here" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-sky-100/20 px-4 text-[10px] tracking-[.14em] text-sky-50/75 transition-colors hover:border-sky-100/55 hover:text-white"><ArrowLeft size={14} />BACK</Link>
      <section className="flex min-h-[calc(100svh-7rem)] max-w-3xl flex-col justify-center py-16">
        <h1 className="text-[clamp(4rem,15vw,8rem)] font-semibold leading-[.82] tracking-[-.08em] text-white">BUILD</h1>
        <p className="mt-7 text-lg leading-relaxed text-sky-50/70 sm:text-xl">Turn ideas into real things.</p>
        <p className="mt-12 border-t border-sky-100/15 pt-5 text-[10px] tracking-[.16em] text-sky-300">BUILD PAGE</p>
      </section>
    </div>
  </main>;
}
