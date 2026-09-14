"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "framer-motion";

type MaskedHeadingProps = {
  text: string;
  src: string;
  className?: string;
  mediaType?: "image" | "video";
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: "rise" | "wipe" | "fade" | "none";
  trigger?: "view" | "hover" | "immediate";
  duration?: number;
  stagger?: number;
  align?: "left" | "center" | "right";
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "div";
  style?: CSSProperties;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * A measured SVG text mask: the supplied media appears only inside the glyphs.
 * It is deliberately client-only because it reads layout and pointer coordinates.
 */
export default function MaskedHeading({
  text,
  src,
  className = "",
  mediaType = "image",
  poster = "",
  fillScale = 1.22,
  parallax = 22,
  drift = 12,
  brightness = 1.08,
  saturation = 1.08,
  grayscale = false,
  reveal = "rise",
  trigger = "view",
  duration = 1.1,
  stagger = 0.07,
  align = "center",
  weight = 700,
  tracking = -0.045,
  lineHeight = 1.02,
  textScale = 0.102,
  tag: Tag = "h2",
  style,
}: MaskedHeadingProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const revealRef = useRef<HTMLSpanElement | null>(null);
  const mediaRef = useRef<HTMLSpanElement | null>(null);
  const unitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baselineRefs = useRef<(HTMLElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const offsets = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const reduceMotion = useReducedMotion();
  const clipId = `masked-heading-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Chinese text has no natural word boundaries, so revealing character by
  // character gives the same staggered cadence as words do in English.
  const splitIntoCharacters = !/\s/.test(text.trim());
  const units = useMemo(() => {
    const trimmed = text.trim();
    return /\s/.test(trimmed) ? trimmed.split(/\s+/).filter(Boolean) : Array.from(trimmed).filter((unit) => unit !== " ");
  }, [text]);

  const placeMedia = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;

    const maxX = Math.max(0, ((fillScale - 1) / 2) * root.clientWidth);
    const maxY = Math.max(0, ((fillScale - 1) / 2) * root.clientHeight);
    const { x, y } = offsets.current;

    media.style.transform = `translate3d(${clamp(x, -maxX, maxX).toFixed(2)}px, ${clamp(y, -maxY, maxY).toFixed(2)}px, 0) scale(${fillScale})`;
    media.style.filter = `brightness(${brightness}) saturate(${saturation})${grayscale ? " grayscale(1)" : ""}`;
  }, [brightness, fillScale, grayscale, saturation]);

  const syncMask = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;

    root.style.fontSize = `${clamp(root.clientWidth * textScale, 36, 164).toFixed(1)}px`;
    const computed = window.getComputedStyle(measure);

    units.forEach((_, index) => {
      const unit = unitRefs.current[index];
      const baseline = baselineRefs.current[index];
      const glyph = glyphRefs.current[index];
      if (!unit || !baseline || !glyph) return;

      glyph.setAttribute("x", String(unit.offsetLeft));
      glyph.setAttribute("y", String(baseline.offsetTop));
      glyph.style.fontFamily = computed.fontFamily;
      glyph.style.fontSize = computed.fontSize;
      glyph.style.fontWeight = computed.fontWeight;
      glyph.style.fontStyle = computed.fontStyle;
      glyph.style.letterSpacing = computed.letterSpacing;
    });

    placeMedia();
  }, [placeMedia, textScale, units]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    syncMask();
    const observer = new ResizeObserver(syncMask);
    observer.observe(root);
    document.fonts?.ready.then(syncMask).catch(() => undefined);

    if (reduceMotion) return () => observer.disconnect();

    let animationFrame = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (now: number) => {
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      elapsed += delta;
      const state = offsets.current;
      const ease = 1 - Math.exp(-delta / 0.2);
      const driftX = Math.sin(elapsed * 0.23) * drift;
      const driftY = Math.cos(elapsed * 0.17) * drift * 0.56;
      state.x += (state.targetX + driftX - state.x) * ease;
      state.y += (state.targetY + driftY - state.y) * ease;
      placeMedia();
      animationFrame = requestAnimationFrame(update);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 2 - 1;
      const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * 2 - 1;
      offsets.current.targetX = clamp(x, -1, 1) * -parallax;
      offsets.current.targetY = clamp(y, -1, 1) * -parallax;
    };
    const onPointerLeave = () => {
      offsets.current.targetX = 0;
      offsets.current.targetY = 0;
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    animationFrame = requestAnimationFrame(update);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [drift, parallax, placeMedia, reduceMotion, syncMask]);

  useEffect(() => {
    const root = rootRef.current;
    const layer = revealRef.current;
    const glyphs = glyphRefs.current.filter((glyph): glyph is SVGTextElement => Boolean(glyph));
    if (!root || !layer || glyphs.length === 0) return;

    const reset = () => {
      gsap.set(glyphs, { y: 0 });
      gsap.set(layer, { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
    };
    const restingState = () => {
      if (reveal === "rise") gsap.set(glyphs, { y: (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.16 });
      if (reveal === "wipe") gsap.set(layer, { clipPath: "inset(0% 100% 0% 0%)" });
      if (reveal === "fade") gsap.set(layer, { opacity: 0, scale: 1.05 });
    };
    const play = () => {
      tweenRef.current?.kill();
      if (reveal === "rise") {
        tweenRef.current = gsap.to(glyphs, { y: 0, duration, stagger, ease: "power4.out", overwrite: "auto" });
      } else if (reveal === "wipe") {
        tweenRef.current = gsap.to(layer, { clipPath: "inset(0% 0% 0% 0%)", duration, ease: "power3.inOut", overwrite: "auto" });
      } else if (reveal === "fade") {
        tweenRef.current = gsap.to(layer, { opacity: 1, scale: 1, duration, ease: "power3.out", overwrite: "auto" });
      }
    };

    if (reduceMotion || reveal === "none") {
      reset();
      return;
    }

    if (trigger === "hover") {
      reset();
      root.addEventListener("pointerenter", play);
      return () => {
        root.removeEventListener("pointerenter", play);
        tweenRef.current?.kill();
      };
    }

    if (trigger === "view") {
      restingState();
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          play();
          observer.disconnect();
        },
        { threshold: 0.3 },
      );
      observer.observe(root);
      return () => {
        observer.disconnect();
        tweenRef.current?.kill();
      };
    }

    play();
    return () => tweenRef.current?.kill();
  }, [duration, reduceMotion, reveal, stagger, trigger, units]);

  return (
    <Tag
      ref={rootRef as never}
      className={`masked-heading ${splitIntoCharacters ? "masked-heading--characters" : ""} ${className}`.trim()}
      style={{ textAlign: align, fontWeight: weight, letterSpacing: `${tracking}em`, lineHeight, ...style }}
    >
      <span ref={measureRef} className="masked-heading__measure" aria-hidden="true">
        {units.map((unit, index) => (
          <span key={`${unit}-${index}`} ref={(element) => { unitRefs.current[index] = element; }} className="masked-heading__word">
            {unit}
            <i ref={(element) => { baselineRefs.current[index] = element; }} className="masked-heading__baseline" />
          </span>
        ))}
      </span>
      <svg className="masked-heading__defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {units.map((unit, index) => <text key={`${unit}-${index}`} ref={(element) => { glyphRefs.current[index] = element; }}>{unit}</text>)}
          </clipPath>
        </defs>
      </svg>
      <span ref={revealRef} className="masked-heading__reveal" aria-hidden="true">
        <span className="masked-heading__clip" style={{ clipPath: `url(#${clipId})` }}>
          <span ref={mediaRef} className="masked-heading__media">
            {mediaType === "video" ? <video className="masked-heading__source" src={src} poster={poster} autoPlay muted loop playsInline /> : <img className="masked-heading__source" src={src} alt="" draggable={false} />}
          </span>
        </span>
      </span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
