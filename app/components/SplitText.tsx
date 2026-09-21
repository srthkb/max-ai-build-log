"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((progress: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: CSSProperties["textAlign"];
  allowOverflow?: boolean;
  onLetterAnimationComplete?: () => void;
};

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  allowOverflow = false,
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const completed = useRef(false);
  const callback = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    callback.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useGSAP(() => {
    if (!ref.current || !text || !fontsLoaded || completed.current) return;
    const element = ref.current;
    const startPercent = (1 - threshold) * 100;
    const margin = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = margin ? Number.parseFloat(margin[1]) : 0;
    const marginUnit = margin?.[2] || "px";
    const offset = marginValue === 0 ? "" : marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPercent}%${offset}`;
    let targets: Element[] = [];

    const split = new GSAPSplitText(element, {
      type: splitType,
      smartWrap: true,
      autoSplit: splitType === "lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
      reduceWhiteSpace: false,
      onSplit: (instance) => {
        if (splitType.includes("chars") && instance.chars.length) targets = instance.chars;
        if (!targets.length && splitType.includes("words") && instance.words.length) targets = instance.words;
        if (!targets.length && splitType.includes("lines") && instance.lines.length) targets = instance.lines;
        if (!targets.length) targets = instance.chars || instance.words || instance.lines;

        return gsap.fromTo(targets, { ...from }, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: { trigger: element, start, once: true, fastScrollEnd: true, anticipatePin: 0.4 },
          force3D: true,
          onComplete: () => {
            completed.current = true;
            callback.current?.();
          },
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) trigger.kill();
      });
      split.revert();
    };
  }, { dependencies: [text, delay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded], scope: ref });

  const Tag = tag;
  const inline = tag === "span";
  return <Tag ref={ref as never} className={`split-parent ${className}`.trim()} style={{ textAlign, overflow: allowOverflow ? "visible" : "hidden", display: inline ? "inline-block" : "block", width: inline ? undefined : "100%", whiteSpace: "normal", wordWrap: "break-word", willChange: "transform, opacity" }}>{text}</Tag>;
}
