"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Point = { x: number; y: number; z: number; phase: number };

function SignalField({ reduceMotion }: { reduceMotion: boolean | null }) {
  const particles = useMemo<Point[]>(() => Array.from({ length: 180 }, (_, index) => {
    const column = index % 18;
    const row = Math.floor(index / 18);
    const x = (column - 8.5) * 0.39 + Math.sin(index * 1.71) * 0.07;
    const y = (row - 4.5) * 0.28 + Math.cos(index * 1.37) * 0.08;
    return { x, y, z: -0.25 - Math.abs(x) * 0.14 + Math.sin(index * 0.73) * 0.16, phase: index * 0.32 };
  }), []);
  const position = useMemo(() => new Float32Array(particles.flatMap((point) => [point.x, point.y, point.z])), [particles]);
  const links = useMemo(() => {
    const values = new Float32Array(54 * 2 * 3);
    for (let index = 0; index < 54; index += 1) {
      const from = particles[(index * 3) % particles.length];
      const to = particles[(index * 11 + 31) % particles.length];
      values.set([from.x, from.y, from.z - 0.03, to.x, to.y, to.z - 0.03], index * 6);
    }
    return values;
  }, [particles]);
  const points = useRef<THREE.Points>(null);
  const pulse = useRef(0);

  useFrame((state, delta) => {
    const geometry = points.current?.geometry;
    const attribute = geometry?.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!attribute) return;

    const values = attribute.array as Float32Array;
    const time = state.clock.getElapsedTime();
    const pointerX = state.pointer.x * 3.5;
    const pointerY = state.pointer.y * 2.15;
    pulse.current = Math.max(0, pulse.current - delta * 1.5);

    particles.forEach((point, index) => {
      const distance = Math.hypot(point.x - pointerX, point.y - pointerY);
      const influence = reduceMotion ? 0 : Math.exp(-distance * distance * 1.5) * (0.24 + pulse.current * 0.26);
      const wave = reduceMotion ? 0 : Math.sin(time * 1.2 + point.phase) * 0.055;
      values[index * 3] = point.x + (point.x - pointerX) * influence * 0.2;
      values[index * 3 + 1] = point.y + wave + (point.y - pointerY) * influence * 0.16;
      values[index * 3 + 2] = point.z + Math.sin(time * 0.9 + point.phase) * 0.11 + influence * 0.48;
    });
    attribute.needsUpdate = true;
  });

  return <group onPointerDown={() => { pulse.current = 1; }}>
    <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[position, 3]} /></bufferGeometry><pointsMaterial color="#b9ecff" size={0.052} sizeAttenuation transparent opacity={0.88} depthWrite={false} /></points>
    <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[links, 3]} /></bufferGeometry><lineBasicMaterial color="#74cbff" transparent opacity={0.15} depthWrite={false} /></lineSegments>
  </group>;
}

function SignalScene({ reduceMotion }: { reduceMotion: boolean | null }) {
  return <>
    <color attach="background" args={["#06101d"]} />
    <fog attach="fog" args={["#06101d", 3.8, 10]} />
    <ambientLight intensity={0.85} color="#bcecff" />
    <pointLight position={[0, 1.4, 2.8]} intensity={5} distance={7} color="#3caeff" />
    <gridHelper args={[10, 24, "#195b86", "#0b2940"]} position={[0, -1.65, -1.8]} rotation={[Math.PI / 2.75, 0, 0]} />
    <SignalField reduceMotion={reduceMotion} />
  </>;
}

export default function AwakeningSignal() {
  const reduceMotion = useReducedMotion();

  return <div className="relative mt-10 h-[220px] overflow-hidden rounded-2xl border border-sky-200/25 bg-[#06101d] shadow-[0_20px_60px_rgba(0,0,0,.45),0_0_48px_rgba(56,189,248,.12)] sm:mt-14 sm:h-[300px] sm:rounded-3xl">
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.4], fov: 48 }} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ touchAction: "pan-y" }}>
      <SignalScene reduceMotion={reduceMotion} />
    </Canvas>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_20%,rgba(3,9,18,.38)_76%),linear-gradient(90deg,rgba(3,9,18,.45),transparent_45%,rgba(3,9,18,.3))]" />
    <p className="pointer-events-none absolute left-5 top-5 text-[9px] font-medium tracking-[.18em] text-sky-100/70 sm:left-7 sm:top-6 sm:text-[10px] sm:tracking-[.24em]">AWAKENING SIGNAL / TOUCH THE FIELD</p>
    <p className="pointer-events-none absolute bottom-5 left-5 text-[9px] font-medium tracking-[.15em] text-sky-100/65 sm:bottom-6 sm:left-7 sm:text-[10px] sm:tracking-[.22em]">FROM UNCERTAINTY TO ACTION</p>
  </div>;
}
