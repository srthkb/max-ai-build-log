import ArticleLayout from "../components/ArticleLayout";
import AwakeningSignal from "../components/AwakeningSignal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI趋势与企业架构重塑",
  description: "拆解未来 5 年企业如何拥抱 AI 原生架构，以及普通人如何理解这场变革。",
};

export default function ResearchPage() {
  return <ArticleLayout eyebrow="[ 01 / RESEARCH ]" title="AI趋势与企业架构重塑" lead="从技术演进到商业落地，拆解未来5年企业如何拥抱 AI 原生架构。" visualLabel="DATA FLOW / AI-NATIVE ARCHITECTURE" visual={<AwakeningSignal text="AI趋势与企业架构重塑" topLabel="RESEARCH SIGNAL / PARTICLE TYPE" bottomLabel="DATA FLOW / AI-NATIVE ARCHITECTURE" sampleStep={3} alphaThreshold={90} particleSize={1.25} fontSize="clamp(3.4rem, 14vw, 9rem)" />}>
    <p className="mb-8 text-neutral-400">当前 AI 布局的核心优势，在于掌握打破“组织惯性”的主动权。当 AI 真正融入企业基因，决策效率、人才结构与创新试错空间都将发生质变。这不仅是一次技术的升级，更是一场生产关系的重塑。</p>

    <p className="mb-8 text-neutral-400">随着 Astra 等前沿模型的发布，许多前端建模与 UI 设计师已开始广泛应用，产出效果令人惊艳。然而，对于小型设计机构和个体创作者而言，目前 AI 并未呈现出明显的替代趋势。这证明：工具的平权并不意味着竞争的终结，真正的壁垒在于如何将工具转化为商业价值。</p>

    <p className="mb-8 text-neutral-400">要在企业内部完成这场架构重塑，绝非简单的技术叠加，而是需要极度稀缺的“三层复合能力”：</p>

    <div className="mb-10 divide-y divide-neutral-800/50 border-y border-neutral-800/50">
      <div className="py-7">
        <h2 className="font-semibold text-white transition-colors duration-200 hover:text-yellow-400">第一层：商业底层能力</h2>
        <p className="mt-3 text-neutral-400">懂沟通、懂战略、懂组织架构，能站在企业经营的视角审视问题。</p>
      </div>
      <div className="py-7">
        <h2 className="font-semibold text-white transition-colors duration-200 hover:text-yellow-400">第二层：业务拆解能力</h2>
        <p className="mt-3 text-neutral-400">深入企业内部，将完整的业务链路拆清楚、捋明白，并将协同沟通贯穿落地全程。</p>
      </div>
      <div className="py-7">
        <h2 className="font-semibold text-white transition-colors duration-200 hover:text-yellow-400">第三层：AI 产品经理能力</h2>
        <p className="mt-3 text-neutral-400">把真实的业务需求，精准转化为可落地、可执行的 AI 方案。</p>
      </div>
    </div>

    <p className="border-l-2 border-yellow-500 pl-4 text-[16px] leading-[1.9] text-neutral-300">这三层能力全部配齐，才能将企业 AI 做得专业、做得漂亮。然而，具备这种复合条件的人极少，这也直接导致当前市场上的 AI 落地服务良莠不齐。我的目标，正是通过不断推演与实践，补齐并贯通这三层能力，为企业提供真正有结果的专业落地服务。</p>
  </ArticleLayout>;
}
