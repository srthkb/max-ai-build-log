"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  onReveal?: () => void;
};

export default function ScrollReveal({ children, className, delay = 0, onReveal }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(50px)" };
  const visible = reduceMotion ? { opacity: 1 } : { opacity: 1, transform: "translateY(0)" };

  return <motion.div className={className} initial={hidden} whileInView={visible} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }} onViewportEnter={onReveal}>{children}</motion.div>;
}
