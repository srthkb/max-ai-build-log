"use client";

import { motion, useReducedMotion } from "framer-motion";

const easeOut = [0.23, 1, 0.32, 1] as const;

type DiagramNodeProps = {
  x: number;
  y: number;
  device: string;
  role: string;
  delay: number;
};

function DiagramNode({ x, y, device, role, delay }: DiagramNodeProps) {
  const reduceMotion = useReducedMotion();

  return <motion.g
    initial={reduceMotion ? false : { opacity: 0, transform: "translateY(8px)" }}
    whileInView={reduceMotion ? undefined : { opacity: 1, transform: "translateY(0px)" }}
    viewport={{ once: true, amount: 0.65 }}
    transition={{ duration: 0.42, delay, ease: easeOut }}
  >
    <circle cx={x} cy={y} r="7" fill="currentColor" />
    <text x={x} y={y - 30} textAnchor="middle" className="personal-ai-diagram__device">{device}</text>
    <text x={x} y={y + 43} textAnchor="middle" className="personal-ai-diagram__role">{role}</text>
  </motion.g>;
}

export default function PersonalAIDiagram() {
  const reduceMotion = useReducedMotion();

  const line = (d: string, delay: number) => <motion.path
    d={d}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    initial={reduceMotion ? false : { pathLength: 0, opacity: 0.22 }}
    whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 0.72 }}
    viewport={{ once: true, amount: 0.55 }}
    transition={{ duration: 0.7, delay, ease: easeOut }}
  />;

  return <figure className="personal-ai-diagram">
    <svg viewBox="0 0 760 520" role="img" aria-labelledby="personal-ai-diagram-title personal-ai-diagram-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="personal-ai-diagram-title">Personal AI device relationship diagram</title>
      <desc id="personal-ai-diagram-desc">AI Glasses provide visual output, AI Ring confirms user intent, and the Phone provides computation and authorization.</desc>
      <g className="personal-ai-diagram__lines">
        {line("M380 142 L206 376", 0)}
        {line("M380 142 L554 376", 0.12)}
        {line("M206 376 L554 376", 0.24)}
      </g>
      <DiagramNode x={380} y={142} device="AI GLASSES" role="SEE" delay={0.36} />
      <DiagramNode x={206} y={376} device="AI RING" role="CONFIRM" delay={0.48} />
      <DiagramNode x={554} y={376} device="PHONE" role="COMPUTE" delay={0.6} />
    </svg>
  </figure>;
}
