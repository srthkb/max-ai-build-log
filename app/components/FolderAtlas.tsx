"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { LearningCard } from "../data/learningCards";

type Props = { skills: LearningCard[]; revealed: boolean };

function SystemFolder({ skills }: { skills: LearningCard[] }) {
  const [open, setOpen] = useState(false);
  return <section className="folder-atlas__stage" data-open={open ? "true" : undefined}><div className="folder-atlas__files" aria-hidden={!open}>{skills.map((skill, index) => <Link key={skill.id} href={skill.href} tabIndex={open ? 0 : -1} className="folder-atlas__file" style={{ "--folder-index": index, "--file-tilt": `${[-7, 6, 4, -5][index]}deg` } as CSSProperties}><strong>{skill.cardTitle || skill.title}</strong></Link>)}</div><button type="button" className="folder-atlas__folder" aria-label={open ? "Close learning files" : "Open learning files"} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className="folder-atlas__back" aria-hidden="true" /><span className="folder-atlas__paper" aria-hidden="true" /><span className="folder-atlas__front" aria-hidden="true"><span className="folder-atlas__number">SYSTEM / SKILL ATLAS</span><strong>MAX / LEARNING FILES</strong><span className="folder-atlas__hint">{open ? "SELECT A FILE" : "CLICK TO OPEN"}</span></span></button></section>;
}

export default function FolderAtlas({ skills, revealed }: Props) {
  const selectedSkill = skills[0];
  if (!selectedSkill) return null;
  return <div className="folder-atlas mt-10"><motion.div initial={{ opacity: 0, y: 20 }} animate={revealed ? { opacity: 1, y: 0 } : {}} transition={{ duration: .42, ease: [0.23, 1, 0.32, 1] }}><SystemFolder skills={skills} /></motion.div><AnimatePresence mode="wait"><motion.article key={selectedSkill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2, ease: [0.23, 1, 0.32, 1] }} className="folder-atlas__summary"><p>{selectedSkill.number} / FILE SUMMARY</p><h3>{selectedSkill.title}</h3><p className="folder-atlas__summary-copy">{selectedSkill.summary}</p><Link href={selectedSkill.href}>OPEN DETAIL ↗</Link></motion.article></AnimatePresence></div>;
}
