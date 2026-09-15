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

type Particle = { x: number; y: number; startX: number; startY: number; targetX: number; targetY: number; size: number; color: string; seed: number; delay: number };

type ParticleTextSignalProps = {
  text?: string;
  topLabel?: string;
  bottomLabel?: string;
  sampleStep?: number;
  alphaThreshold?: number;
  particleSize?: number;
};

/** Canvas particle text, replacing the previous 3D particle grid. */
export default function AwakeningSignal({
  text = DEFAULT_PARTICLE_TEXT,
  topLabel = DEFAULT_TOP_LABEL,
  bottomLabel = DEFAULT_BOTTOM_LABEL,
  sampleStep = 3,
  alphaThreshold = 40,
  particleSize = 1,
}: ParticleTextSignalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return;

    let particles: Particle[] = [];
    let animationFrame = 0;
    let resizeFrame = 0;
    let buildId = 0;
    let gathering = false;
    let gatherStart = 0;
    let width = 0;
    let height = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { active: false, x: 0, y: 0, smoothX: 0, smoothY: 0 };
    const baseColor = hexToRgb("#e0f7ff");
    const highlightColor = hexToRgb("#38bdf8");

    const startGather = (fromScatter: boolean) => {
      if (!particles.length) return;
      const now = performance.now();
      for (const particle of particles) {
        if (fromScatter && !reducedMotion) {
          const angle = particle.seed * Math.PI * 2;
          const distance = 160 * (0.42 + particle.seed * 0.72);
          particle.x = particle.targetX + Math.cos(angle) * distance + (particle.seed - 0.5) * 100;
          particle.y = particle.targetY + Math.sin(angle) * distance + (particle.seed - 0.5) * 82;
        }
        particle.startX = particle.x;
        particle.startY = particle.y;
        particle.delay = reducedMotion ? 0 : particle.seed * 360;
      }
      gatherStart = now;
      gathering = !reducedMotion;
    };

    const render = (now: number) => {
      context.clearRect(0, 0, width, height);
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.15;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.15;
      // Keep glyph edges crisp. A per-particle blur merged neighbouring Chinese strokes.
      context.shadowBlur = 0;
      let complete = true;

      for (const particle of particles) {
        let targetX = particle.targetX;
        let targetY = particle.targetY;
        let progress = 1;
        if (gathering) {
          progress = clamp((now - gatherStart - particle.delay) / 1280, 0, 1);
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
        const follow = reducedMotion ? 1 : 0.2;
        particle.x += (targetX - particle.x) * follow;
        particle.y += (targetY - particle.y) * follow;
        context.globalAlpha = clamp(0.32 + progress * 0.68, 0, 1);
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      if (complete) gathering = false;
      animationFrame = window.requestAnimationFrame(render);
    };

    const sampleText = async () => {
      const currentBuild = ++buildId;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontFamily = window.getComputedStyle(container).fontFamily || "sans-serif";
      let fontSize = resolveFontSize("clamp(2rem, 6vw, 4.8rem)", container, fontFamily);
      let font = `800 ${fontSize}px ${fontFamily}`;
      if (document.fonts) await document.fonts.ready;
      if (currentBuild !== buildId) return;
      const offscreen = document.createElement("canvas");
      const offContext = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offContext) return;
      offContext.font = font;
      const maxTextWidth = width * 0.86;
      const initialMetrics = offContext.measureText(text);
      if (initialMetrics.width > maxTextWidth) {
        fontSize = Math.max(22, fontSize * (maxTextWidth / initialMetrics.width));
        font = `800 ${fontSize}px ${fontFamily}`;
        offContext.font = font;
      }
      const metrics = offContext.measureText(text);
      const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);
      const right = Math.ceil(metrics.actualBoundingBoxRight || metrics.width);
      const ascent = Math.ceil(metrics.actualBoundingBoxAscent || fontSize * 0.78);
      const descent = Math.ceil(metrics.actualBoundingBoxDescent || fontSize * 0.22);
      const textWidth = left + right;
      const padding = Math.max(14, Math.ceil(fontSize * 0.11));
      offscreen.width = textWidth + padding * 2;
      offscreen.height = ascent + descent + padding * 2;
      offContext.font = font;
      offContext.fillStyle = "#fff";
      offContext.textBaseline = "alphabetic";
      offContext.fillText(text, padding - left, padding + ascent);

      const pixels = offContext.getImageData(0, 0, offscreen.width, offscreen.height).data;
      const targets: { x: number; y: number }[] = [];
      for (let y = 0; y < offscreen.height; y += sampleStep) {
        for (let x = 0; x < offscreen.width; x += sampleStep) {
          if (pixels[(y * offscreen.width + x) * 4 + 3] > alphaThreshold) targets.push({ x: width / 2 - offscreen.width / 2 + x, y: height / 2 - offscreen.height / 2 + y });
        }
      }
      const maxParticles = Math.max(1100, Math.min(3600, Math.floor((width * height) / 78)));
      const stride = Math.max(1, Math.ceil(targets.length / maxParticles));
      particles = targets.filter((_, index) => index % stride === 0).map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const color = baseColor && highlightColor ? mixRgb(baseColor, highlightColor, clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.26, 0, 1)) : "#e0f7ff";
        const angle = seed * Math.PI * 2;
        const distance = reducedMotion ? 0 : 160 * (0.42 + seed * 0.72);
        return { x: target.x + Math.cos(angle) * distance, y: target.y + Math.sin(angle) * distance, startX: target.x, startY: target.y, targetX: target.x, targetY: target.y, size: particleSize * (1.05 + seed * 0.42), color, seed, delay: seed * 360 };
      });
      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;
      startGather(false);
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
  }, [alphaThreshold, particleSize, sampleStep, text]);

  return <div ref={containerRef} className="relative mt-10 h-[220px] overflow-hidden rounded-2xl border border-sky-100/35 bg-[#050b14] shadow-[0_24px_66px_rgba(0,0,0,.5),0_0_64px_rgba(56,189,248,.2)] sm:mt-14 sm:h-[300px] sm:rounded-3xl">
    <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block size-full touch-pan-y" />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(56,189,248,.08),transparent_48%),linear-gradient(90deg,rgba(3,9,18,.5),transparent_24%,transparent_76%,rgba(3,9,18,.5))]" />
    <p className="pointer-events-none absolute left-5 top-5 text-[9px] font-medium tracking-[.18em] text-sky-50/85 sm:left-7 sm:top-6 sm:text-[10px] sm:tracking-[.24em]">{topLabel}</p>
    <p className="pointer-events-none absolute bottom-5 left-5 text-[9px] font-medium tracking-[.15em] text-sky-100/80 sm:bottom-6 sm:left-7 sm:text-[10px] sm:tracking-[.22em]">{bottomLabel}</p>
    <span className="sr-only">{text}</span>
  </div>;
}
