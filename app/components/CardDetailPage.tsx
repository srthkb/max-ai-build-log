import Link from "next/link";
import type { LearningCard } from "../data/learningCards";

export default function CardDetailPage({ card }: { card: LearningCard }) {
  return <main className="min-h-screen bg-[#030912] px-5 py-20 text-sky-50 sm:px-6 sm:py-28 md:px-12"><div className="mx-auto max-w-5xl"><Link href="/#skills" className="inline-flex min-h-11 items-center rounded-full border border-sky-100/25 px-4 py-2 text-[10px] tracking-[.14em] text-sky-100 transition hover:border-sky-100 hover:bg-sky-100 hover:text-[#06204a]">← 返回主页</Link><p className="mt-14 text-[10px] tracking-[.16em] text-sky-300 sm:mt-20 sm:tracking-[.22em]">[ {card.number} / {card.status} ]</p><h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[.9] tracking-[-.08em] sm:text-5xl md:text-8xl">{card.title}</h1><p className="mt-9 max-w-2xl text-lg leading-relaxed text-sky-50/70 sm:mt-12 sm:text-xl">{card.summary}</p><section className="mt-14 border-t border-sky-100/15 pt-7 sm:mt-20"><p className="text-[10px] tracking-[.16em] text-sky-300">DETAILS / COMING SOON</p><p className="mt-4 max-w-xl text-base leading-relaxed text-sky-50/55">这里是这张卡片的详情页。后续你可以持续补充文章、案例、图片和新的研究记录。</p></section></div></main>;
}
