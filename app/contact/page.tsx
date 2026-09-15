import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AwakeningSignal from "../components/AwakeningSignal";

export const metadata = {
  title: "CONTACT",
  description: "LET’S BUILD SOMETHING — 一起做点什么。",
};

export default function ContactPage() {
  return (
    <main className="site-space min-h-[100svh] overflow-x-clip text-[#f5f9ff]">
      <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-12">
        <Link href="/" className="text-xl font-semibold tracking-[-0.08em] text-white">
          MAX<span className="ml-0.5 align-top text-[8px] text-sky-300">®</span>
        </Link>
        <Link href="/" className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-sky-100/20 px-4 text-[10px] font-medium tracking-[.14em] text-sky-50/75 transition-colors duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.06] hover:text-white">
          <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          BACK
        </Link>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:pb-24 sm:pt-20 md:px-12 md:pb-28 md:pt-24">
        <section className="border-b border-sky-100/15 pb-10 md:pb-14">
          <p className="text-[10px] tracking-[.18em] text-sky-300">[ CONTACT / BUILD SIGNAL ]</p>
          <div className="mt-5 max-w-5xl">
            <AwakeningSignal text={'LET’S BUILD\nSOMETHING\n一起做点什么'} topLabel="" bottomLabel="" sampleStep={4} alphaThreshold={130} particleSize={1.05} fontSize="clamp(3rem, 12vw, 7rem)" framed={false} />
          </div>
        </section>
        <div className="flex flex-col items-start gap-3 border-b border-sky-100/15 py-6 text-xs leading-relaxed tracking-[.14em] text-left text-sky-100/70 sm:flex-row sm:items-center sm:gap-8">
          <span>WeChat: MKXyang888</span>
          <a href="mailto:zijingzeyang@gmail.com" className="transition-colors hover:text-white">email: zijingzeyang@gmail.com</a>
        </div>

      </div>
    </main>
  );
}
