"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import SkillAtlas, { type Note } from "./components/SkillAtlas";
import { learningCards } from "./data/learningCards";
import ParticleTerrain from "./components/ParticleTerrain";
import ScrollReveal from "./components/ScrollReveal";
import SplitText from "./components/SplitText";

const links = ["Skills", "Build log", "Projects", "About"];

function formatDate(date: Date) {
  const part = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${part(date.getMonth() + 1)}-${part(date.getDate())} ${part(date.getHours())}:${part(date.getMinutes())}`;
}

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [skillsRevealed, setSkillsRevealed] = useState(false);

  // A browser restores the fragment position on reload (for example /#skills).
  // The homepage should always start at its Hero, so clear a stale fragment first.
  useLayoutEffect(() => {
    const originalRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));

    return () => {
      window.cancelAnimationFrame(frame);
      window.history.scrollRestoration = originalRestoration;
    };
  }, []);

  useEffect(() => {
    const updateNav = () => setScrolled(window.scrollY > 48);
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    try {
      setNotes(JSON.parse(window.localStorage.getItem("max-ai-build-skill-notes") || "{}"));
    } catch {
      setNotes({});
    }
    return () => window.removeEventListener("scroll", updateNav);
  }, []);

  const saveNote = (id: string, text: string) => {
    const nextNotes = { ...notes, [id]: { text: text.trim(), updatedAt: formatDate(new Date()) } };
    setNotes(nextNotes);
    window.localStorage.setItem("max-ai-build-skill-notes", JSON.stringify(nextNotes));
  };

  return (
    <main className="site-space overflow-x-clip text-[#f5f9ff]">
      <nav className={`fixed inset-x-0 top-0 z-50 mx-auto flex h-16 items-center justify-between px-5 transition-[top,width,padding,background-color,border-radius] duration-300 md:h-20 md:px-12 ${scrolled ? "top-3 w-[94%] max-w-6xl rounded-full border border-white/25 bg-black/35 px-5 shadow-[0_16px_60px_rgba(0,0,0,.3)] backdrop-blur-2xl md:top-4 md:px-8" : "w-full"}`}>
        <a href="#top" className="text-xl font-semibold tracking-[-0.08em] text-white">MAX<span className="ml-0.5 align-top text-[8px] text-sky-300">®</span></a>
        <div className="hidden items-center gap-7 text-[11px] font-medium tracking-[.14em] text-sky-50/75 md:flex">
          {links.map((link) => <a className="transition hover:text-white" href={`#${link.toLowerCase().replace(" ", "-")}`} key={link}>{link.toUpperCase()}</a>)}
        </div>
        <button aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition active:scale-95 md:hidden" onClick={() => setMenuOpen(true)}><Menu size={19} /></button>
      </nav>

      <AnimatePresence>
        {menuOpen && <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 220 }} className="fixed inset-0 z-[60] flex flex-col bg-[#030912] p-5 sm:p-7 md:hidden">
          <button aria-label="Close menu" className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-white/15 transition active:scale-95" onClick={() => setMenuOpen(false)}><X size={20} /></button>
          <div className="mt-auto flex flex-col gap-5 pb-10 text-4xl font-semibold tracking-[-.08em] sm:gap-7 sm:pb-12 sm:text-5xl">{links.map((link) => <a className="inline-flex min-h-11 items-center" onClick={() => setMenuOpen(false)} href={`#${link.toLowerCase().replace(" ", "-")}`} key={link}>{link}</a>)}</div>
        </motion.div>}
      </AnimatePresence>

      <section id="top" className="particle-hero relative flex min-h-[100svh] items-end overflow-hidden px-5 pb-7 pt-24 md:min-h-screen md:px-12 md:pb-12 md:pt-28">
        <ParticleTerrain />
        <div className="particle-veil absolute inset-0" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end">
          <h1 className="max-w-5xl text-[clamp(4rem,19vw,12rem)] font-black leading-[.79] tracking-[-.105em] text-white md:text-[clamp(4.4rem,12.5vw,12rem)] md:leading-[.76]"><SplitText tag="span" text="重塑" delay={80} duration={1.25} ease="power3.out" from={{ opacity: 0, y: 48 }} to={{ opacity: 1, y: 0 }} textAlign="left" allowOverflow /><br /><span className="text-white/80"><SplitText tag="span" text="未来" delay={80} duration={1.25} ease="power3.out" from={{ opacity: 0, y: 48 }} to={{ opacity: 1, y: 0 }} textAlign="left" allowOverflow /></span></h1>
          <div className="mt-7 flex flex-col gap-6 border-t border-white/30 pt-5 md:mt-9 md:flex-row md:items-end md:justify-between md:gap-7">
            <div><SplitText tag="p" className="text-[8px] font-medium tracking-[.12em] text-white/75 sm:text-[10px] sm:tracking-[.3em]" text="PERSONAL KNOWLEDGE SYSTEM" delay={24} duration={.9} ease="power3.out" from={{ opacity: 0, y: 18 }} to={{ opacity: 1, y: 0 }} textAlign="left" /><SplitText tag="p" className="mt-2 text-[8px] font-medium tracking-[.1em] text-white/75 sm:text-[10px] sm:tracking-[.3em]" text="LEARNING LOG & AI / EMBRACE THE FUTURE" delay={24} duration={.9} ease="power3.out" from={{ opacity: 0, y: 18 }} to={{ opacity: 1, y: 0 }} textAlign="left" /><p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">AGI 时代已经到来，改变世界，你和我，将趋势变成可落地的数字资产。</p></div>
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3"><Link href="/start-here" className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[11px] font-semibold tracking-[.08em] text-[#0b0c10] transition hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,.5)]">START HERE 开始入门 <ArrowDownRight size={15} className="transition group-hover:translate-y-0.5" /></Link><Link href="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/55 bg-black/10 px-5 py-3 text-[11px] font-semibold tracking-[.08em] text-white backdrop-blur-sm transition hover:scale-[1.03] hover:bg-white/15 hover:shadow-[0_0_28px_rgba(255,255,255,.22)]">联系我 <ArrowUpRight size={15} /></Link></div>
          </div>
        </div>
        <div className="absolute bottom-7 right-12 z-10 hidden text-[9px] tracking-[.18em] text-white/65 md:block">SCROLL TO EXPLORE ↓</div>
      </section>

      <section id="skills" className="skill-atlas-section relative px-5 py-20 md:px-12 md:py-36"><div className="blue-haze" /><div className="relative mx-auto max-w-7xl"><SectionHeader index="02" title="SKILL ATLAS" copy="A living system of what I’m learning and applying." /><ScrollReveal delay={0.08} onReveal={() => setSkillsRevealed(true)}><SkillAtlas skills={learningCards} notes={notes} onSave={saveNote} onOpen={(href) => router.push(href)} revealed={skillsRevealed} /></ScrollReveal></div></section>

      <section id="build-log" className="border-y border-sky-100/10 bg-[#050d18]/82 px-5 py-20 backdrop-blur-sm sm:px-6 md:px-12 md:py-36"><div className="mx-auto max-w-7xl"><SectionHeader index="03" title="BUILD LOG" copy="Not just notes. Evidence of progress." /><div className="mt-10 grid border-t border-sky-100/15 sm:mt-12 lg:grid-cols-2"><ScrollReveal delay={0.05}><article className="flex min-h-72 flex-col justify-between border-b border-sky-100/15 py-8 lg:min-h-80 lg:border-b-0 lg:border-r lg:py-9 lg:pr-12"><p className="text-[10px] tracking-[.18em] text-sky-300">SEPT / 2026</p><h2 className="text-3xl font-medium leading-[.9] tracking-[-.07em] sm:text-4xl md:text-6xl">Building a personal<br /><span className="text-sky-300">AI learning archive.</span></h2><span className="text-[11px] tracking-[.12em]">FIRST SIGNAL →</span></article></ScrollReveal><ol className="divide-y divide-sky-100/15 lg:pl-12"><LogItem delay={0.12} date="09.13" title="Site / v1.0" copy="重构为一套具备空间感与动态层次的 AI 学习档案。" /><LogItem delay={0.2} date="NEXT" title="Next protocol" copy="记录下一次真正改变工作方式的实验。" /><LogItem delay={0.28} date="OPEN" title="Open slot" copy="Keep learning. Keep building." /></ol></div></div></section>

      <section id="projects" className="px-5 py-20 sm:px-6 md:px-12 md:py-36"><div className="mx-auto max-w-7xl"><SectionHeader index="04" title="SELECTED OUTPUT" copy="Things made while learning in public." /><ScrollReveal delay={0.1}><motion.article whileHover={{ transform: "translateY(-5px)" }} className="group mt-10 grid gap-6 border-y border-sky-100/15 py-9 md:grid-cols-[140px_1fr_auto] md:items-start md:py-10"><span className="text-[10px] tracking-[.16em] text-sky-300">01 / 01</span><div><p className="text-[10px] tracking-[.16em] text-sky-300">WEB EXPERIENCE</p><h2 className="mt-4 text-4xl font-semibold leading-none tracking-[-.08em] sm:text-5xl md:text-7xl">Max / AI Build Log</h2><p className="mt-5 text-base leading-relaxed text-sky-50/60">一个持续生长的个人作品档案，也是第一个公开实验。</p><Link href="/awakening" className="mt-7 inline-flex min-h-11 items-center rounded-full border border-sky-100/35 px-4 py-3 text-[10px] tracking-[.14em] text-sky-100 transition hover:border-sky-100 hover:bg-sky-100 hover:text-[#06204a]">进入觉醒日志 →</Link></div><span className="grid h-12 w-12 place-items-center rounded-full border border-sky-100/45 text-sky-100 transition group-hover:bg-sky-100 group-hover:text-[#041426]"><ArrowUpRight /></span></motion.article></ScrollReveal></div></section>

      <section id="about" className="relative overflow-hidden border-t border-sky-100/10 bg-[#07101f] px-5 py-20 sm:px-6 md:px-12 md:py-36"><div className="aurora" /><div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[.7fr_1.3fr]"><ScrollReveal><p className="text-[10px] tracking-[.18em] text-sky-300">[ 05 — ABOUT MAX ]</p></ScrollReveal><ScrollReveal delay={0.1}><div><h2 className="text-4xl font-semibold leading-[.86] tracking-[-.08em] sm:text-5xl md:text-8xl">I learn in public<br />so ideas can become <span className="text-sky-300">real.</span></h2><p className="mt-9 max-w-md text-base leading-relaxed text-sky-50/65 sm:mt-12 sm:text-lg">这是我的 AI 实验现场。记录输入，也记录输出；保留过程中的不确定性，更在意真正完成的作品。</p><a href="mailto:hello@example.com" className="mt-8 inline-flex min-h-11 items-center border-b border-sky-300 pb-2 text-[11px] tracking-[.12em] text-sky-200">LET&apos;S CONNECT ↗</a></div></ScrollReveal></div></section>
      <ScrollReveal delay={0.05}><footer className="flex flex-col items-center gap-3 px-5 py-7 text-center text-[10px] tracking-[.12em] text-sky-50/45 sm:flex-row sm:justify-between sm:px-6 sm:text-left md:px-12"><span>© 2026 MAX</span><span>BUILT WITH CURIOSITY + AI</span><a className="inline-flex min-h-11 items-center" href="#top">BACK TO TOP ↑</a></footer></ScrollReveal>
    </main>
  );
}

function SectionHeader({ index, title, copy }: { index: string; title: string; copy: string }) { return <ScrollReveal><div className="flex flex-col justify-between gap-5 border-b border-sky-100/15 pb-6 md:flex-row md:items-end"><div><p className="text-[10px] tracking-[.18em] text-sky-300">[ {index} ]</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.06em] md:text-4xl">{title}</h2></div><p className="max-w-xs text-base leading-snug text-sky-50/55 md:max-w-44 md:text-right">{copy}</p></div></ScrollReveal>; }

function LogItem({ date, title, copy, delay }: { date: string; title: string; copy: string; delay: number }) { return <li><ScrollReveal delay={delay} className="grid grid-cols-[66px_1fr] gap-5 py-8"><time className="text-[10px] tracking-[.12em] text-sky-300">{date}</time><div><h3 className="text-lg">{title}</h3><p className="mt-2 text-sm leading-relaxed text-sky-50/55">{copy}</p></div></ScrollReveal></li>; }
