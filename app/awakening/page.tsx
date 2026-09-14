import ArticleLayout from "../components/ArticleLayout";
import AwakeningQuote from "../components/AwakeningQuote";
import AwakeningSignal from "../components/AwakeningSignal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "非程序员的AI觉醒日志",
  description: "记录一个非程序员借助 AI 从恐惧到行动、完成生产力跃迁的真实过程。",
};

const highlight = "font-medium text-sky-200 underline decoration-sky-300/80 decoration-2 underline-offset-4 drop-shadow-[0_0_12px_rgba(125,211,252,.34)]";

export default function AwakeningPage() {
  return <ArticleLayout eyebrow="[ 03 / AWAKENING ]" title="非程序员的AI觉醒日志" lead="从恐惧到行动，记录一个普通人借助 AI 完成生产力跃迁的真实过程。" visualLabel="AWAKENING / FROM FEAR TO ACTION" visualTheme="awakening" visual={<AwakeningSignal />} showTopBack={false} ending={<AwakeningQuote />}>
    <p className="mb-10 text-xl leading-[1.85] text-sky-50/90">从前段时间接触到一些 AI 发展的信息，我就感觉在现在这个时代，AI 是发展的一个主要趋势。未来企业会逐渐转型，向智能化靠拢，但是普通人该怎么办？作为没有任何编程基础的我该怎么办？</p>
    <p className="mb-10">突然就感觉无从下手，根本不知道从哪一步开始。于是我就开始了学习，选择从抖音开始，一步一步知道了一些基本专业名词的含义：<span className={highlight}>Skill 是什么、Codex 是什么、Agent 是什么</span>……</p>
    <p className="mb-10">包括怎么去搭建网络环境，调用 Skill 和 GitHub 开源的一些东西。在干了一段时间后，竟然不知不觉、神奇地搭建好了第一个个人站。</p>
    <blockquote className="mb-10 border-l-2 border-sky-300/75 bg-sky-200/[.05] px-6 py-5 text-xl font-medium leading-relaxed text-sky-50/90">全程没跑一行代码。</blockquote>
    <p className="mb-10">发布之后我感觉非常开心，同时也持一种悲观态度：以前这活应该可能干一周，现在几个小时、一天就能完成。悲观是真切体验到了之前所说的 AI 的恐怖之处。</p>
    <p className="mb-10">虽然可能其实搭建这个网站对于一些大佬来说非常简单，后续我会在网站上分享一些使用 Skill，以及一些新手使用 Codex 或者 Claude Code 中出现的一些问题。</p>
  </ArticleLayout>;
}
