import Link from "next/link";
import type { ReactNode } from "react";

type ArticleLayoutProps = {
  eyebrow: string;
  title: string;
  lead: string;
  visualLabel: string;
  children: ReactNode;
  summary?: string;
  relatedLabel?: string;
  relatedHref?: string;
  visualTheme?: "default" | "awakening";
  showTopBack?: boolean;
  ending?: ReactNode;
};

export default function ArticleLayout({ eyebrow, title, lead, visualLabel, children, summary, relatedLabel, relatedHref, visualTheme = "default", showTopBack = true, ending }: ArticleLayoutProps) {
  const awakening = visualTheme === "awakening";
  const visualBackground = awakening ? "bg-gradient-to-br from-[#2a071e] via-[#451229] to-[#5c350b]" : "bg-gradient-to-br from-[#082a63] via-[#17265f] to-[#2b1249]";
  const firstGlow = awakening ? "bg-rose-400/25" : "bg-sky-300/25";
  const secondGlow = awakening ? "bg-amber-300/20" : "bg-violet-400/25";

  return <main className="relative min-h-[100svh] overflow-hidden bg-[#030912] px-5 py-24 text-sky-50 sm:px-6 sm:py-28 md:px-12"><div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.05] [background-image:linear-gradient(rgba(147,197,253,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,.7)_1px,transparent_1px)] [background-size:28px_28px] sm:[background-size:36px_36px]" /><article className="relative mx-auto max-w-3xl">{showTopBack && <Link href="/#skills" className="inline-flex min-h-11 items-center rounded-full border border-sky-100/25 px-4 py-2 text-[10px] tracking-[.14em] text-sky-100 transition hover:border-sky-100 hover:bg-sky-100 hover:text-[#06204a]">← 返回主页</Link>}<header className={showTopBack ? "mt-14 sm:mt-20" : "mt-0"}><p className="text-[9px] tracking-[.18em] text-sky-300 sm:text-[10px] sm:tracking-[.22em]">{eyebrow}</p><h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[.94] tracking-[-.08em] sm:text-5xl md:text-8xl">{title}</h1><p className="mt-7 max-w-2xl text-lg leading-relaxed text-sky-50/80 sm:mt-10 sm:text-xl">{lead}</p></header><div className={`relative mt-10 h-[220px] overflow-hidden rounded-2xl border border-sky-200/15 sm:mt-14 sm:h-[300px] sm:rounded-3xl ${visualBackground}`}><div className={`absolute -left-16 top-8 h-56 w-56 rounded-full blur-3xl ${firstGlow}`} /><div className={`absolute bottom-0 right-4 h-56 w-80 rounded-full blur-3xl ${secondGlow}`} /><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,.24),transparent_18%),linear-gradient(115deg,transparent_15%,rgba(255,255,255,.13)_46%,transparent_55%)]" /><p className="absolute bottom-5 left-5 text-[9px] font-medium tracking-[.15em] text-sky-50/70 sm:bottom-6 sm:left-7 sm:text-[10px] sm:tracking-[.24em]">{visualLabel}</p></div><section className="mt-10 text-[15px] leading-[1.9] text-sky-50/70 sm:mt-14 sm:text-base md:text-lg">{children}</section>{summary && <section className="mt-12 rounded-2xl border border-sky-300/50 bg-sky-300/[.06] p-5 shadow-[0_0_38px_rgba(56,189,248,.14)] sm:mt-16 sm:p-7"><p className="text-[10px] tracking-[.18em] text-sky-300">CORE VIEWPOINT</p><p className="mt-3 text-lg font-medium leading-relaxed text-sky-50 sm:text-xl">{summary}</p></section>}{relatedLabel && relatedHref && <Link href={relatedHref} className="mt-8 inline-flex min-h-11 items-center rounded-full border border-sky-100/30 px-5 py-3 text-[11px] tracking-[.12em] text-sky-100 transition hover:border-sky-100 hover:bg-sky-100 hover:text-[#06204a]">{relatedLabel} →</Link>}{ending}</article></main>;
}
