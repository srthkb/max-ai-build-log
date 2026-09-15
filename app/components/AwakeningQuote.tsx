"use client";

import Link from "next/link";
import MaskedHeading from "./MaskedHeading";

export default function AwakeningQuote() {
  return <section className="masked-quote relative left-1/2 mt-16 flex min-h-[62vh] w-screen -translate-x-1/2 flex-col items-center justify-center overflow-hidden px-5 text-center sm:mt-24 sm:min-h-[72vh] sm:px-6"><div aria-hidden="true" className="masked-quote__glow" /><MaskedHeading text="未来没人会知道，但现在，就可改变未来。" src="/awakening-signal.svg" fillScale={1.3} parallax={26} drift={16} reveal="rise" trigger="view" duration={1.15} stagger={0.065} align="center" weight={700} tracking={-0.05} lineHeight={1.03} textScale={0.106} className="relative z-10 mx-auto max-w-6xl font-sans" /><Link href="/#skills" className="relative z-10 mt-12 inline-flex min-h-11 items-center rounded-full border border-sky-100/35 px-5 py-3 text-[11px] tracking-[.14em] text-sky-100 transition hover:border-sky-100 hover:bg-sky-100 hover:text-[#06101d] sm:mt-16">返回主页</Link></section>;
}
