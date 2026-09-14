import ArticleLayout from "../components/ArticleLayout";
import AwakeningQuote from "../components/AwakeningQuote";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "非程序员的AI觉醒日志",
  description: "记录一个非程序员借助 AI 从恐惧到行动、完成生产力跃迁的真实过程。",
};

const highlight = "font-medium text-rose-200 underline decoration-amber-300/80 decoration-2 underline-offset-4 drop-shadow-[0_0_12px_rgba(251,191,36,.34)]";

const stages = [
  ["01", "认知觉醒", "拉响警报"],
  ["02", "0代码实战", "建站 / 小程序"],
  ["03", "持续进化", "拥抱 AI"],
];

export default function AwakeningPage() {
  return <ArticleLayout eyebrow="[ 03 / AWAKENING ]" title="非程序员的AI觉醒日志" lead="从恐惧到行动，记录一个普通人借助 AI 完成生产力跃迁的真实过程。" visualLabel="AWAKENING / FROM FEAR TO ACTION" visualTheme="awakening" showTopBack={false} ending={<AwakeningQuote />}><p className="mb-10 text-xl leading-[1.85] text-sky-50/90">时代的巨浪打过来时，连一声招呼都不会打。作为一个非程序员，当AGI真实降临时，我最大的感受不是兴奋，而是恐惧——<span className={highlight}>害怕被时代抛弃</span>，害怕自己成为那个被淘汰的旁观者。于是，我给自己拉响了最高级别的警报：必须立刻改变。</p><p className="mb-10">我停止了观望，开始行动。从一知半解到用AI搭建出这个网站、跑通小程序，我没有写一行代码，也没有耗费太久的时间。但这短短的时间里，我完成了一次不可思议的跃迁。我突然明白，技术的壁垒正在坍塌，AI才是普通人撬动世界的新杠杆。</p><section className="mb-10 border-y border-amber-100/15 py-8"><p className="text-[10px] tracking-[.2em] text-amber-200">RAPID EVOLUTION / TIMELINE</p><ol className="mt-7 grid gap-5 md:grid-cols-3">{stages.map(([number, title, detail]) => <li key={number} className="relative border-l border-amber-200/35 pl-5"><span className="text-[10px] tracking-[.14em] text-amber-200">{number}</span><h2 className="mt-3 text-xl font-medium text-sky-50">{title}</h2><p className="mt-2 text-sm text-sky-50/55">{detail}</p></li>)}</ol></section><p className="mb-10">现在，我不再焦虑。因为行动，就是治愈恐惧的唯一解药。</p></ArticleLayout>;
}
