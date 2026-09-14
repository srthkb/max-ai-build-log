"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

const fallbackStream = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const source = process.env.NEXT_PUBLIC_HERO_HLS_URL || fallbackStream;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.play().catch(() => undefined);
      return;
    }

    if (!Hls.isSupported()) return;
    const hls = new Hls({ enableWorker: true, lowLatencyMode: true, capLevelToPlayerSize: true });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => undefined));
    return () => hls.destroy();
  }, []);

  return <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />;
}
