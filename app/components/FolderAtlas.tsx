"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Matter from "matter-js";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { LearningCard } from "../data/learningCards";

type Props = { skills: LearningCard[]; onOpen: (href: LearningCard["href"]) => void; revealed: boolean };
const { Bodies, Body, Composite, Engine } = Matter;

function SystemFolder({ skills, onSelect, onOpen }: { skills: LearningCard[]; onSelect: (skill: LearningCard) => void; onOpen: (href: LearningCard["href"]) => void }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const fileRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const physics = useRef<{ engine: Matter.Engine | null; raf: number; bodies: Matter.Body[]; last: number }>({ engine: null, raf: 0, bodies: [], last: 0 });
  const stopPhysics = useCallback(() => { const current = physics.current; cancelAnimationFrame(current.raf); if (current.engine) { Composite.clear(current.engine.world, false, true); Engine.clear(current.engine); } fileRefs.current.forEach((file) => { file?.style.removeProperty("--folder-x"); file?.style.removeProperty("--folder-y"); file?.style.removeProperty("--folder-r"); }); physics.current = { engine: null, raf: 0, bodies: [], last: 0 }; }, []);
  const startPhysics = useCallback(() => {
    if (reduceMotion || !zoneRef.current || physics.current.engine) return;
    const zone = zoneRef.current; const files = fileRefs.current.filter((file): file is HTMLButtonElement => Boolean(file)); if (!files.length) return;
    const engine = Engine.create({ gravity: { x: 0, y: 0 } }); const width = zone.clientWidth; const height = zone.clientHeight;
    const initial = [[.35, .26], [.65, .25], [.39, .43], [.63, .42]];
    const bodies = files.map((file, index) => Bodies.rectangle(width * initial[index][0], height * initial[index][1], file.offsetWidth, file.offsetHeight, { chamfer: { radius: 8 }, frictionAir: .16, restitution: .3, inertia: Infinity, plugin: { phase: index * 1.7 } }));
    const wall = 48;
    Composite.add(engine.world, [...bodies, Bodies.rectangle(width / 2, -wall / 2, width + wall * 2, wall, { isStatic: true }), Bodies.rectangle(width / 2, height + wall / 2, width + wall * 2, wall, { isStatic: true }), Bodies.rectangle(-wall / 2, height / 2, wall, height + wall * 2, { isStatic: true }), Bodies.rectangle(width + wall / 2, height / 2, wall, height + wall * 2, { isStatic: true })]);
    physics.current = { engine, raf: 0, bodies, last: 0 };
    const frame = (now: number) => { const current = physics.current; if (!current.engine) return; const delta = current.last ? Math.min(32, now - current.last) : 16; current.last = now; const t = now / 1000; current.bodies.forEach((body, index) => { const phase = (body.plugin as { phase?: number }).phase ?? 0; Body.applyForce(body, body.position, { x: Math.sin(t * .72 + phase) * .000008 * body.mass, y: Math.cos(t * .91 + phase) * .000007 * body.mass }); const file = files[index]; file.style.setProperty("--folder-x", `${(body.position.x - width / 2).toFixed(1)}px`); file.style.setProperty("--folder-y", `${(body.position.y - height / 2).toFixed(1)}px`); file.style.setProperty("--folder-r", `${(body.angle * 57.3).toFixed(2)}deg`); }); Engine.update(current.engine, delta); current.raf = requestAnimationFrame(frame); };
    physics.current.raf = requestAnimationFrame(frame);
  }, [reduceMotion]);
  // The files have fixed authored destinations. Do not hand their position to the
  // physics loop after the opening transition, otherwise they visibly correct twice.
  useEffect(() => { if (!open) stopPhysics(); }, [open, stopPhysics]);
  useEffect(() => stopPhysics, [stopPhysics]);
  const selectFile = (skill: LearningCard) => { setPicked(skill.id); onSelect(skill); window.setTimeout(() => onOpen(skill.href), 120); };
  return <section ref={zoneRef} className="folder-atlas__stage" data-open={open ? "true" : undefined}><div className="folder-atlas__files" aria-hidden={!open}>{skills.map((skill, index) => <button key={skill.id} ref={(element) => { fileRefs.current[index] = element; }} type="button" tabIndex={open ? 0 : -1} className="folder-atlas__file" data-picked={picked === skill.id ? "true" : undefined} style={{ "--folder-index": index, "--file-tilt": `${[-7, 6, 4, -5][index]}deg` } as CSSProperties} onClick={() => selectFile(skill)}><strong>{skill.cardTitle || skill.title}</strong></button>)}</div><button type="button" className="folder-atlas__folder" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className="folder-atlas__back" aria-hidden="true" /><span className="folder-atlas__paper" aria-hidden="true" /><span className="folder-atlas__front" aria-hidden="true"><span className="folder-atlas__number">SYSTEM / SKILL ATLAS</span><strong>MAX / LEARNING FILES</strong><span className="folder-atlas__hint">{open ? "SELECT A FILE" : "CLICK TO OPEN"}</span></span></button></section>;
}

export default function FolderAtlas({ skills, onOpen, revealed }: Props) {
  const [selectedId, setSelectedId] = useState(skills[0]?.id ?? "");
  const selectedSkill = skills.find((skill) => skill.id === selectedId) ?? skills[0];
  if (!selectedSkill) return null;
  return <div className="folder-atlas mt-10"><motion.div initial={{ opacity: 0, y: 20 }} animate={revealed ? { opacity: 1, y: 0 } : {}} transition={{ duration: .42, ease: [0.23, 1, 0.32, 1] }}><SystemFolder skills={skills} onSelect={(skill) => setSelectedId(skill.id)} onOpen={onOpen} /></motion.div><AnimatePresence mode="wait"><motion.article key={selectedSkill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2, ease: [0.23, 1, 0.32, 1] }} className="folder-atlas__summary"><p>{selectedSkill.number} / FILE SUMMARY</p><h3>{selectedSkill.title}</h3><p className="folder-atlas__summary-copy">{selectedSkill.summary}</p><Link href={selectedSkill.href}>OPEN DETAIL ↗</Link></motion.article></AnimatePresence></div>;
}
