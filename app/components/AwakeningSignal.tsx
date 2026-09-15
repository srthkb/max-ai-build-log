"use client";

import { useEffect, useRef } from "react";

type Rgb = { r: number; g: number; b: number };

const DEFAULT_PARTICLE_TEXT = "MaxForge | AI网站设计";
const DEFAULT_TOP_LABEL = "AWAKENING SIGNAL / PARTICLE TYPE";
const DEFAULT_BOTTOM_LABEL = "MOVE THROUGH THE FIELD";

function hexToRgb(hex: string): Rgb | null {
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return { r: Number.parseInt(clean.slice(0, 2), 16), g: Number.parseInt(clean.slice(2, 4), 16), b: Number.parseInt(clean.slice(4, 6), 16) };
}

function mixRgb(from: Rgb, to: Rgb, amount: number) {
  return `rgb(${Math.round(from.r + (to.r - from.r) * amount)}, ${Math.round(from.g + (to.g - from.g) * amount)}, ${Math.round(from.b + (to.b - from.b) * amount)})`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function resolveFontSize(value: string, container: HTMLElement, fontFamily: string) {
  const probe = document.createElement("span");
  probe.textContent = "M";
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;font-size:${value};font-weight:800;font-family:${fontFamily};`;
  container.appendChild(probe);
  const size = Number.parseFloat(window.getComputedStyle(probe).fontSize) || 56;
  probe.remove();
  return size;
}

type Particle = { x: number; y: number; startX: number; startY: number; targetX: number; targetY: number; size: number; color: string; seed: number; delay: number; visible: boolean };

type ParticleTextSignalProps = {
  text?: string;
  topLabel?: string;
  bottomLabel?: string;
  sampleStep?: number;
  alphaThreshold?: number;
  particleSize?: number;
  fontSize?: string;
  framed?: boolean;
  sequence?: string[];
  sequenceSampleSteps?: number[];
  sequenceAlphaThresholds?: number[];
};

/** Canvas particle text, replacing the previous 3D particle grid. */
export default function AwakeningSignal({
  text = DEFAULT_PARTICLE_TEXT,
  topLabel = DEFAULT_TOP_LABEL,
  bottomLabel = DEFAULT_BOTTOM_LABEL,
  sampleStep = 3,
  alphaThreshold = 40,
  particleSize = 1,
  fontSize: fontSizeValue = "clamp(2rem, 6vw, 4.8rem)",
  framed = true,
  sequence,
  sequenceSampleSteps,
  sequenceAlphaThresholds,
}: ParticleTextSignalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return;

    let particles: Particle[] = [];
    const textSequence = sequence?.length ? sequence : [text];
    let animationFrame = 0;
    let resizeFrame = 0;
    let buildId = 0;
    let phase: "gather" | "hold" | "scatter" = "gather";
    let phaseStart = 0;
    let sequenceIndex = 0;
    let pendingTargets: ({ x: number; y: number } | null)[] | null = null;
    let targetSequence: ({ x: number; y: number } | null)[][] = [];
    let width = 0;
    let height = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { active: false, x: 0, y: 0, smoothX: 0, smoothY: 0 };
    const baseColor = hexToRgb("#e0f7ff");
    const highlightColor = hexToRgb("#38bdf8");
    const boundedScatterDistance = (distance: number) => width <= 600 ? Math.min(distance, Math.min(width * 0.08, height * 0.18)) : distance;

    const render = (now: number) => {
      context.clearRect(0, 0, width, height);
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.15;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.15;
      context.shadowBlur = 0;
      let complete = true;
      let activeProgress = 1;

      if (phase === "hold" && textSequence.length > 1 && now - phaseStart >= 1000 && pendingTargets) {
        phase = "scatter";
        phaseStart = now;
        for (const particle of particles) {
          particle.startX = particle.x;
          particle.startY = particle.y;
          const angle = particle.seed * Math.PI * 2 + Math.sin(particle.seed * 19) * 0.35;
          const distance = boundedScatterDistance(72 + particle.seed * 150);
          particle.targetX = particle.x + Math.cos(angle) * distance;
          particle.targetY = particle.y + Math.sin(angle) * distance;
          particle.delay = particle.seed * 120;
        }
      }

      for (const particle of particles) {
        let targetX = particle.targetX;
        let targetY = particle.targetY;
        let progress = 1;
        if (phase === "gather") {
          progress = clamp((now - phaseStart - particle.delay) / 1200, 0, 1);
          const eased = easeOutCubic(progress);
          targetX = particle.startX + (particle.targetX - particle.startX) * eased;
          targetY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) complete = false;
        } else if (phase === "scatter") {
          progress = clamp((now - phaseStart - particle.delay) / 900, 0, 1);
          const eased = easeOutCubic(progress);
          targetX = particle.startX + (particle.targetX - particle.startX) * eased;
          targetY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reducedMotion) {
          const driftTime = now * 0.001;
          targetX += Math.sin(driftTime * 0.86 + particle.seed * 13) * 0.62;
          targetY += Math.cos(driftTime * 0.7 + particle.seed * 11) * 0.56;
        }
        if (pointer.active && !reducedMotion) {
          const dx = targetX - pointer.smoothX;
          const dy = targetY - pointer.smoothY;
          const distance = Math.hypot(dx, dy);
          if (distance > 0.01 && distance < 126) {
            const force = (1 - distance / 126) ** 2 * 38;
            targetX += (dx / distance) * force;
            targetY += (dy / distance) * force;
          }
        }
        if (phase === "gather" || phase === "scatter") {
          particle.x = targetX;
          particle.y = targetY;
        } else {
          const follow = reducedMotion ? 1 : 0.2;
          particle.x += (targetX - particle.x) * follow;
          particle.y += (targetY - particle.y) * follow;
        }
        activeProgress = Math.min(activeProgress, progress);
        if (particle.visible) {
          context.globalAlpha = phase === "scatter" ? clamp(1 - progress * 0.38, 0.48, 1) : clamp(0.32 + progress * 0.68, 0, 1);
          context.fillStyle = particle.color;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      if (complete && phase === "scatter" && pendingTargets) {
        for (const [index, particle] of particles.entries()) {
          const target = pendingTargets[index % pendingTargets.length];
          particle.startX = particle.x;
          particle.startY = particle.y;
          particle.targetX = target?.x ?? particle.x;
          particle.targetY = target?.y ?? particle.y;
          particle.visible = target !== null;
          particle.delay = reducedMotion ? 0 : particle.seed * 180;
        }
        pendingTargets = null;
        phase = "gather";
        phaseStart = now;
      } else if (complete && phase === "gather") {
        phase = "hold";
        phaseStart = now;
        sequenceIndex = (sequenceIndex + 1) % textSequence.length;
        pendingTargets = targetSequence[(sequenceIndex + 1) % textSequence.length] || null;
      }
      void activeProgress;
      animationFrame = window.requestAnimationFrame(render);
    };

    const sampleText = async () => {
      const currentBuild = ++buildId;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      if (width <= 0 || height <= 0) return;
      const isMobileViewport = width <= 600;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobileViewport ? 2 : 2.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontFamily = window.getComputedStyle(container).fontFamily || "sans-serif";
      if (document.fonts) await document.fonts.ready;
      if (currentBuild !== buildId) return;
      const targetSets: { x: number; y: number }[][] = [];
      for (const [textIndex, textValue] of textSequence.entries()) {
        let fontSize = resolveFontSize(fontSizeValue, container, fontFamily);
        let font = `800 ${fontSize}px ${fontFamily}`;
        const offscreen = document.createElement("canvas");
        const offContext = offscreen.getContext("2d", { willReadFrequently: true });
        if (!offContext) return;
        offContext.font = font;
        const lines = textValue.split(/\r?\n/).filter(Boolean);
        const maxTextWidth = width * 0.86;
        const measureLines = () => lines.map((line) => offContext.measureText(line));
        let lineMetrics = measureLines();
        const initialWidth = Math.max(...lineMetrics.map((metrics) => metrics.width), 0);
        if (initialWidth > maxTextWidth) {
          fontSize = Math.max(22, fontSize * (maxTextWidth / initialWidth));
          font = `800 ${fontSize}px ${fontFamily}`;
          offContext.font = font;
          lineMetrics = measureLines();
        }
        const textWidth = Math.ceil(Math.max(...lineMetrics.map((metrics) => metrics.width), 0));
        const ascent = Math.ceil(Math.max(...lineMetrics.map((metrics) => metrics.actualBoundingBoxAscent || fontSize * 0.78), fontSize * 0.78));
        const lineHeight = Math.ceil(fontSize * 1.08);
        const padding = Math.max(14, Math.ceil(fontSize * 0.11));
        const logicalWidth = textWidth + padding * 2;
        const logicalHeight = lineHeight * lines.length + padding * 2;
        offscreen.width = Math.ceil(logicalWidth * dpr);
        offscreen.height = Math.ceil(logicalHeight * dpr);
        offContext.setTransform(dpr, 0, 0, dpr, 0, 0);
        offContext.font = font;
        offContext.fillStyle = "#fff";
        offContext.textBaseline = "alphabetic";
        lines.forEach((line, index) => {
          const lineWidth = offContext.measureText(line).width;
          offContext.fillText(line, padding + (textWidth - lineWidth) / 2, padding + ascent + index * lineHeight);
        });
        const pixels = offContext.getImageData(0, 0, offscreen.width, offscreen.height).data;
        const targets: { x: number; y: number }[] = [];
        const requestedSampleStep = sequenceSampleSteps?.[textIndex] ?? sampleStep;
        const samplingGap = Math.max(2, Math.min(7, Math.round(requestedSampleStep + (isMobileViewport ? 1 : 0) + (fontSize > 72 ? 1 : 0))));
        const pixelGap = samplingGap * dpr;
        for (let y = 0; y < offscreen.height; y += pixelGap) {
          for (let x = 0; x < offscreen.width; x += pixelGap) {
            const pixelX = Math.floor(x);
            const pixelY = Math.floor(y);
            const threshold = sequenceAlphaThresholds?.[textIndex] ?? alphaThreshold;
            if (pixels[(pixelY * offscreen.width + pixelX) * 4 + 3] > threshold) targets.push({ x: width / 2 - logicalWidth / 2 + x / dpr, y: height / 2 - logicalHeight / 2 + y / dpr });
          }
        }
        targetSets.push(targets);
      }
      const particleCount = Math.min(1800, targetSets[0]?.length || 0);
      targetSequence = targetSets.map((targets) => {
        const activeCount = Math.min(targets.length, particleCount);
        return Array.from({ length: particleCount }, (_, index) => index < activeCount ? targets[Math.min(targets.length - 1, Math.floor((index / activeCount) * targets.length))] : null);
      });
      const firstTargets = targetSequence[0] || [];
      const visualParticleScale = isMobileViewport ? 0.82 : 1;
      particles = firstTargets.map((target, index) => {
        if (!target) return null;
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const color = baseColor && highlightColor ? mixRgb(baseColor, highlightColor, clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.26, 0, 1)) : "#e0f7ff";
        const angle = seed * Math.PI * 2;
        const distance = reducedMotion ? 0 : boundedScatterDistance(160 * (0.42 + seed * 0.72));
        const startX = target.x + Math.cos(angle) * distance;
        const startY = target.y + Math.sin(angle) * distance;
        return { x: startX, y: startY, startX, startY, targetX: target.x, targetY: target.y, size: particleSize * visualParticleScale * (1.05 + seed * 0.42), color, seed, delay: seed * 360, visible: true };
      }).filter((particle): particle is Particle => particle !== null);
      pendingTargets = targetSequence[1] || null;
      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;
      phase = reducedMotion ? "hold" : "gather";
      phaseStart = performance.now();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const handlePointerLeave = () => { pointer.active = false; };
    const handleReducedMotion = (event: MediaQueryListEvent) => { reducedMotion = event.matches; void sampleText(); };
    const queueSample = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => { void sampleText(); });
    };
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", handleReducedMotion);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerenter", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    const observer = new ResizeObserver(queueSample);
    observer.observe(container);
    void sampleText();
    animationFrame = window.requestAnimationFrame(render);
    return () => {
      buildId += 1;
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleReducedMotion);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerenter", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
    };
  }, [alphaThreshold, fontSizeValue, particleSize, sampleStep, text, sequence, sequenceAlphaThresholds, sequenceSampleSteps]);

  return <div ref={containerRef} className={framed ? "relative mt-10 h-[220px] overflow-hidden rounded-2xl border border-sky-100/35 bg-[#050b14] shadow-[0_24px_66px_rgba(0,0,0,.5),0_0_64px_rgba(56,189,248,.2)] sm:mt-14 sm:h-[300px] sm:rounded-3xl" : "relative h-[clamp(14rem,40vw,25rem)] overflow-hidden"}>
    <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block size-full touch-pan-y" />
    {framed && <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(56,189,248,.08),transparent_48%),linear-gradient(90deg,rgba(3,9,18,.5),transparent_24%,transparent_76%,rgba(3,9,18,.5))]" />}
    {framed && <><p className="pointer-events-none absolute left-5 top-5 text-[9px] font-medium tracking-[.18em] text-sky-50/85 sm:left-7 sm:top-6 sm:text-[10px] sm:tracking-[.24em]">{topLabel}</p><p className="pointer-events-none absolute bottom-5 left-5 text-[9px] font-medium tracking-[.15em] text-sky-100/80 sm:bottom-6 sm:left-7 sm:text-[10px] sm:tracking-[.22em]">{bottomLabel}</p></>}
    <span className="sr-only">{text}</span>
  </div>;
}
