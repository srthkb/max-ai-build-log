"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function AwakeningQuote() {
  const reduceMotion = useReducedMotion();
  const animation = reduceMotion ? { opacity: 1, transform: "scale(1)" } : { opacity: [0.78, 1, 0.78], transform: ["scale(1)", "scale(1.018)", "scale(1)"] };

  return <section className="relative left-1/2 mt-24 flex min-h-[68vh] w-screen -translate-x-1/2 flex-col items-center justify-center overflow-hidden px-6 text-center"><div aria-hidden="true" className="absolute h-[34rem] w-[34rem] rounded-full bg-rose-500/10 blur-3xl" /><motion.p initial={{ opacity: 0, transform: "translateY(28px) scale(.97)" }} whileInView={{ opacity: 1, transform: "translateY(0) scale(1)" }} viewport={{ once: true, amount: 0.5 }} animate={animation} transition={{ duration: 3.6, ease: [0.77, 0, 0.175, 1], repeat: reduceMotion ? 0 : Infinity, repeatType: "mirror" }} className="relative max-w-6xl text-[clamp(3rem,8vw,8rem)] font-semibold leading-[.9] tracking-[-.08em] text-amber-50 drop-shadow-[0_0_32px_rgba(251,191,36,.26)]">“恐惧来敲门，打开门发现什么都没有了。”</motion.p><Link href="/#skills" className="relative mt-16 rounded-full border border-amber-100/35 px-5 py-3 text-[11px] tracking-[.14em] text-amber-100 transition hover:border-amber-100 hover:bg-amber-100 hover:text-[#2a071e]">返回主页</Link></section>;
}
