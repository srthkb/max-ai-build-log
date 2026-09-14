"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox, Text } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import * as THREE from "three";
import type { LearningCard } from "../data/learningCards";

export type Skill = LearningCard;

export type Note = { text: string; updatedAt: string };

type Props = {
  skills: Skill[];
  notes: Record<string, Note>;
  onSave: (id: string, text: string) => void;
  onOpen: (href: Skill["href"]) => void;
  revealed: boolean;
};

const rimVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const rimFragmentShader = `
  uniform vec2 uPointer;
  uniform float uAngle;
  uniform float uIntensity;
  uniform float uActive;
  varying vec3 vPosition;
  varying vec3 vNormal;

  float roundedRectSdf(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - halfSize + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  float gaussianLine(float distanceToEdge, float thickness) {
    float x = distanceToEdge / thickness;
    return exp(-1.35 * x * x);
  }

  void main() {
    vec2 halfSize = vec2(1.115, 1.535);
    float edgeDistance = roundedRectSdf(vPosition.xy, halfSize, 0.145);
    vec2 direction = vec2(cos(uAngle), sin(uAngle));
    vec2 ellipticalNormal = normalize(vPosition.xy / (halfSize * halfSize) + vec2(0.00001));
    float lightAngle = acos(clamp(abs(dot(ellipticalNormal, direction)), 0.0, 1.0));
    float directionalShine = 1.0 - smoothstep(0.16, 0.9, lightAngle);
    float faceEdge = gaussianLine(edgeDistance, 0.023) * (1.0 - smoothstep(0.045, 0.12, abs(edgeDistance)));
    float sideEdge = pow(1.0 - abs(vNormal.z), 2.0) * 0.42;
    float focus = mix(0.13, 1.0, uActive);
    float glow = (faceEdge + sideEdge) * directionalShine * uIntensity * focus;
    float ambient = (faceEdge + sideEdge * 0.45) * mix(0.05, 0.17, uActive);
    vec3 color = mix(vec3(0.18, 0.61, 1.0), vec3(0.92, 0.98, 1.0), clamp(glow * 1.2, 0.0, 1.0));
    float alpha = clamp(ambient + glow, 0.0, 0.94);
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

// Adapted from the supplied Web Threads fragment program.  It uses card UVs
// (rather than the whole canvas pixels) so each individual 3D card owns a
// complete network-thread field inside its rounded face.
const webThreadsVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const webThreadsFragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uBrightness;
  uniform float uMouseStrength;
  uniform float uMouseActive;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;

  #define TAU 6.28318530718
  #define THREAD_COUNT 6

  float glow(float x, float falloff, float strength) {
    return strength / pow(max(x, 0.0001), falloff);
  }

  float grain(vec2 point) {
    return fract(sin(dot(point + uTime, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  }

  void main() {
    vec2 uv = vUv;
    float pinchX = mix(0.5, uMouse.x, uMouseActive * 0.3);
    float spreadDx = 0.18 * abs(uv.x - pinchX);
    float baseTime = uTime * 0.17;
    float yOffset = uv.y - 0.5;
    vec3 color = vec3(0.0);
    float totalGlow = 0.0;

    for (int index = 0; index < THREAD_COUNT; index++) {
      float i = float(index);
      float amplitude = spreadDx * (1.0 + i);
      float phase = (baseTime + i * (TAU / float(THREAD_COUNT))) * sign(pinchX - uv.x);
      float sdf = abs(yOffset + sin(uv.x * 5.0 + phase) * amplitude) / 1.1;
      float threadGlow = glow(sdf, 0.6, 0.02);
      vec3 threadColor = mix(uColor1, uColor2, i / float(THREAD_COUNT - 1));
      color += threadGlow * threadColor;
      totalGlow += threadGlow;
    }

    float core = smoothstep(0.5, 2.2, totalGlow);
    color = mix(color, uColor3 * totalGlow, core * 0.5);
    float mouseDistance = dot(uv - uMouse, uv - uMouse);
    float mouseBloom = uMouseActive * uMouseStrength * exp(-mouseDistance * 6.0) * 0.6;
    color *= uBrightness + mouseBloom;
    float alpha = clamp(totalGlow, 0.0, 1.0) * uOpacity;
    float noise = grain(uv * 211.0) * 0.025;
    color = max(color + noise, vec3(0.0));
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

function WebThreadsCardBackground({ cardRef, active, compact }: { cardRef: React.RefObject<THREE.Group | null>; active: boolean; compact: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const plane = useMemo(() => new THREE.Plane(), []);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const worldPointer = useMemo(() => new THREE.Vector3(), []);
  const localPointer = useMemo(() => new THREE.Vector3(), []);
  const worldNormal = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const reducedMotion = useRef(false);
  const mouseState = useRef({ x: 0.5, y: 0.5, active: 0 });
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 0.38 },
    uBrightness: { value: 0.48 },
    uMouseStrength: { value: 0.18 },
    uMouseActive: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColor1: { value: new THREE.Color("#1f83c7") },
    uColor2: { value: new THREE.Color("#8ed8ff") },
    uColor3: { value: new THREE.Color("#e7f7ff") },
  }), []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reducedMotion.current = query.matches; };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useFrame((state, delta) => {
    const card = cardRef.current;
    const shader = material.current;
    if (!card || !shader) return;

    card.getWorldPosition(worldPosition);
    card.getWorldQuaternion(quaternion);
    worldNormal.set(0, 0, 1).applyQuaternion(quaternion);
    plane.setFromNormalAndCoplanarPoint(worldNormal, worldPosition);
    const hit = state.raycaster.ray.intersectPlane(plane, worldPointer);
    const pointer = mouseState.current;
    let targetActive = 0;

    if (hit) {
      localPointer.copy(worldPointer);
      card.worldToLocal(localPointer);
      const inside = Math.abs(localPointer.x) <= 1.01 && Math.abs(localPointer.y) <= 1.43;
      if (inside && !compact) {
        pointer.x = THREE.MathUtils.clamp((localPointer.x + 1.01) / 2.02, 0, 1);
        pointer.y = THREE.MathUtils.clamp((localPointer.y + 1.43) / 2.86, 0, 1);
        targetActive = 1;
      }
    }

    pointer.active = THREE.MathUtils.damp(pointer.active, targetActive, 6, delta);
    shader.uniforms.uTime.value = reducedMotion.current ? 0 : state.clock.getElapsedTime();
    shader.uniforms.uMouse.value.set(pointer.x, pointer.y);
    shader.uniforms.uMouseActive.value = pointer.active;
    shader.uniforms.uOpacity.value = THREE.MathUtils.damp(shader.uniforms.uOpacity.value, active ? 0.66 : 0.34, 5, delta);
    shader.uniforms.uBrightness.value = THREE.MathUtils.damp(shader.uniforms.uBrightness.value, active ? 0.76 : 0.46, 5, delta);
  });

  return <RoundedBox args={[2.02, 2.86, 0.006]} position={[0, 0, 0.093]} radius={0.11} smoothness={5} renderOrder={1}>
    <shaderMaterial ref={material} vertexShader={webThreadsVertexShader} fragmentShader={webThreadsFragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
  </RoundedBox>;
}

function SpecularRim({ cardRef, active }: { cardRef: React.RefObject<THREE.Group | null>; active: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const plane = useMemo(() => new THREE.Plane(), []);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const worldPointer = useMemo(() => new THREE.Vector3(), []);
  const localPointer = useMemo(() => new THREE.Vector3(), []);
  const worldNormal = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const stateRef = useRef({ angle: 2.4, intensity: active ? 0.17 : 0.045 });
  const uniforms = useMemo(() => ({
    uPointer: { value: new THREE.Vector2(99, 99) },
    uAngle: { value: 2.4 },
    uIntensity: { value: active ? 0.17 : 0.045 },
    uActive: { value: active ? 1 : 0 },
  }), []);

  useFrame((state, delta) => {
    const card = cardRef.current;
    const shader = material.current;
    if (!card || !shader) return;

    card.getWorldPosition(worldPosition);
    card.getWorldQuaternion(quaternion);
    worldNormal.set(0, 0, 1).applyQuaternion(quaternion);
    plane.setFromNormalAndCoplanarPoint(worldNormal, worldPosition);
    const hit = state.raycaster.ray.intersectPlane(plane, worldPointer);
    if (hit) {
      localPointer.copy(worldPointer);
      card.worldToLocal(localPointer);
    } else {
      localPointer.set(99, 99, 0);
    }

    const halfWidth = 1.09;
    const halfHeight = 1.51;
    const dx = Math.max(Math.abs(localPointer.x) - halfWidth, 0);
    const dy = Math.max(Math.abs(localPointer.y) - halfHeight, 0);
    const distance = Math.hypot(dx, dy);
    const proximity = THREE.MathUtils.clamp(1 - distance / 1.35, 0, 1);
    const smoothProximity = proximity * proximity * (3 - 2 * proximity);
    const inside = distance === 0;
    const targetAngle = inside
      ? Math.atan2(2 / 3.02, -2 / 2.18) + (localPointer.x / halfWidth) * 0.3 - (localPointer.y / halfHeight) * 0.15
      : Math.atan2(-localPointer.y, localPointer.x);
    const angleDelta = THREE.MathUtils.euclideanModulo(targetAngle - stateRef.current.angle + Math.PI, Math.PI * 2) - Math.PI;
    stateRef.current.angle += angleDelta * (1 - Math.exp(-delta * 7));
    const baseIntensity = active ? 0.11 : 0.04;
    const targetIntensity = baseIntensity + smoothProximity * (active ? 0.58 : 0.1);
    stateRef.current.intensity = THREE.MathUtils.damp(stateRef.current.intensity, targetIntensity, 8, delta);

    shader.uniforms.uPointer.value.set(localPointer.x, localPointer.y);
    shader.uniforms.uAngle.value = stateRef.current.angle;
    shader.uniforms.uIntensity.value = stateRef.current.intensity;
    shader.uniforms.uActive.value = THREE.MathUtils.damp(shader.uniforms.uActive.value, active ? 1 : 0, 7, delta);
  });

  return <RoundedBox args={[2.25, 3.09, 0.205]} radius={0.145} smoothness={6} renderOrder={4}>
    <shaderMaterial ref={material} vertexShader={rimVertexShader} fragmentShader={rimFragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
  </RoundedBox>;
}

function TypewriterCardTitle({ text, active }: { text: string; active: boolean }) {
  const title = useRef<any>(null);
  const startedAt = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    startedAt.current = null;
    if (title.current) {
      title.current.text = active && reducedMotion.current ? text : "";
      title.current.sync();
    }
  }, [active, text]);

  useFrame((state) => {
    const label = title.current;
    if (!label || !active) return;
    if (reducedMotion.current) return;
    if (startedAt.current === null) startedAt.current = state.clock.getElapsedTime();

    const elapsed = (state.clock.getElapsedTime() - startedAt.current) * 1000;
    const visibleCharacters = Math.min(text.length, Math.floor(elapsed / 75));
    const cursor = Math.floor(state.clock.getElapsedTime() / 0.5) % 2 === 0 ? "_" : " ";
    const nextText = `${text.slice(0, visibleCharacters)}${cursor}`;
    if (label.text !== nextText) {
      label.text = nextText;
      label.sync();
    }
  });

  return <Text ref={title} position={[-0.81, 0.37, 0.1]} anchorX="left" maxWidth={1.6} fontSize={0.245} lineHeight={0.98} color="#f3fbff">{""}</Text>;
}

function CardHud({ active }: { active: boolean }) {
  const opacity = active ? 0.34 : 0.12;
  const nodes = [[-0.66, -0.42], [-0.35, -0.24], [0.04, -0.52], [0.52, -0.16], [0.67, -0.51]];

  return <group position={[0, 0, 0.105]}>
    <mesh position={[0, -0.29, 0]}><planeGeometry args={[1.44, 0.008]} /><meshBasicMaterial color="#9fe2ff" transparent opacity={opacity} /></mesh>
    <mesh position={[-0.5, -0.38, 0]} rotation={[0, 0, -0.36]}><planeGeometry args={[0.36, 0.008]} /><meshBasicMaterial color="#9fe2ff" transparent opacity={opacity} /></mesh>
    <mesh position={[-0.14, -0.38, 0]} rotation={[0, 0, 0.6]}><planeGeometry args={[0.5, 0.008]} /><meshBasicMaterial color="#9fe2ff" transparent opacity={opacity} /></mesh>
    <mesh position={[0.35, -0.34, 0]} rotation={[0, 0, 0.65]}><planeGeometry args={[0.4, 0.008]} /><meshBasicMaterial color="#9fe2ff" transparent opacity={opacity} /></mesh>
    {nodes.map(([x, y], index) => <mesh key={`${x}-${y}`} position={[x, y, 0.012]}><circleGeometry args={[index === 1 ? 0.035 : 0.022, 16]} /><meshBasicMaterial color="#dff7ff" transparent opacity={active ? 0.7 : 0.25} /></mesh>)}
    <mesh position={[-0.91, 1.02, 0]}><planeGeometry args={[0.18, 0.012]} /><meshBasicMaterial color="#a9e8ff" transparent opacity={opacity} /></mesh>
    <mesh position={[-0.99, 0.94, 0]} rotation={[0, 0, Math.PI / 2]}><planeGeometry args={[0.18, 0.012]} /><meshBasicMaterial color="#a9e8ff" transparent opacity={opacity} /></mesh>
    <mesh position={[0.91, -1.02, 0]}><planeGeometry args={[0.18, 0.012]} /><meshBasicMaterial color="#a9e8ff" transparent opacity={opacity} /></mesh>
    <mesh position={[0.99, -0.94, 0]} rotation={[0, 0, Math.PI / 2]}><planeGeometry args={[0.18, 0.012]} /><meshBasicMaterial color="#a9e8ff" transparent opacity={opacity} /></mesh>
  </group>;
}

function Card({ skill, offset, active, onOpen, onHover, revealed, revealDelay, compact }: { skill: Skill; offset: number; active: boolean; onOpen: () => void; onHover: () => void; revealed: boolean; revealDelay: number; compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const revealStart = useRef<number | null>(null);
  const target = useMemo(() => new THREE.Vector3(offset * 2.15, offset === 0 ? 0.06 : -0.08, -Math.abs(offset) * 2.05), [offset]);
  const targetRotation = offset * -0.33;

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!revealed) revealStart.current = null;
    if (revealed && revealStart.current === null) revealStart.current = state.clock.getElapsedTime() + revealDelay;
    const rawProgress = revealStart.current === null ? 0 : THREE.MathUtils.clamp((state.clock.getElapsedTime() - revealStart.current) / 0.7, 0, 1);
    const revealProgress = 1 - Math.pow(1 - rawProgress, 3);
    const positionAlpha = 1 - Math.exp(-delta * 4.35);
    group.current.position.x += (target.x - group.current.position.x) * positionAlpha;
    group.current.position.y += (target.y - (1 - revealProgress) * 0.55 - group.current.position.y) * positionAlpha;
    group.current.position.z += (target.z - group.current.position.z) * positionAlpha;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotation, 5.5, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, state.pointer.y * 0.055, 5.5, delta);
    const targetScale = (active ? 1.055 : Math.max(0.86, 0.96 - Math.abs(offset) * 0.035)) * (0.92 + revealProgress * 0.08);
    const scale = THREE.MathUtils.damp(group.current.scale.x, targetScale, 6, delta);
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group} onPointerOver={(event) => { event.stopPropagation(); onHover(); }} onClick={(event) => { event.stopPropagation(); if (active) onOpen(); else onHover(); }}>
      <RoundedBox args={[2.18, 3.02, 0.16]} radius={0.13} smoothness={5} castShadow receiveShadow>
        <meshPhysicalMaterial color={active ? "#123a67" : "#071a30"} roughness={0.24} metalness={0.38} clearcoat={0.95} clearcoatRoughness={0.1} transmission={0.035} transparent opacity={0.94} />
      </RoundedBox>
      <SpecularRim cardRef={group} active={active} />
      <mesh position={[0, 0, 0.091]}><planeGeometry args={[2.02, 2.85]} /><meshBasicMaterial color={active ? "#0c315a" : "#06172b"} transparent opacity={0.84} /></mesh>
      <WebThreadsCardBackground cardRef={group} active={active} compact={compact} />
      <mesh position={[0, 0.92, 0.097]}><planeGeometry args={[1.82, 0.01]} /><meshBasicMaterial color="#93d8ff" transparent opacity={active ? 0.86 : 0.32} /></mesh>
      <Text position={[-0.81, 1.19, 0.1]} anchorX="left" fontSize={0.105} letterSpacing={0.12} color="#8ed8ff">{skill.number}</Text>
      <Text position={[0.81, 1.19, 0.1]} anchorX="right" fontSize={0.075} letterSpacing={0.08} color="#a5dffb">{skill.status}</Text>
      <CardHud active={active} />
      {active && <><TypewriterCardTitle text={skill.title} active={active} /><Text position={[-0.81, -1.15, 0.1]} anchorX="left" fontSize={0.07} letterSpacing={0.085} color="#b9ecff">{">_ [CLICK TO OPEN]"}</Text></>}
    </group>
  );
}

function Scene({ skills, activeIndex, onSelect, onHover, onOpen, revealed, compact }: { skills: Skill[]; activeIndex: number; onSelect: (index: number) => void; onHover: (index: number) => void; onOpen: (href: Skill["href"]) => void; revealed: boolean; compact: boolean }) {
  const root = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointerX * 0.42, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointerY * 0.25, 4, delta);
    camera.lookAt(0, 0, 0);
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointerX * 0.085, 4, delta);
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -pointerY * 0.04, 4, delta);
    }
  });

  return (
    <>
      <color attach="background" args={["#061222"]} />
      <fog attach="fog" args={["#061222", 8, 16]} />
      <ambientLight intensity={1.15} color="#9fdcff" />
      <directionalLight position={[-4, 5, 5]} intensity={2.2} color="#d6f2ff" castShadow />
      <pointLight position={[2.5, -1, 3]} intensity={11} distance={9} color="#2384dc" />
      {!compact && <ContactShadows position={[0, -1.88, -0.6]} opacity={0.52} scale={12} blur={2.8} far={5.4} color="#00040a" />}
      <Float speed={1.15} rotationIntensity={0.03} floatIntensity={0.1}>
        <group ref={root}>{skills.map((skill, index) => <Card key={skill.id} skill={skill} offset={index - activeIndex} active={index === activeIndex} onOpen={() => onOpen(skill.href)} onHover={() => onHover(index)} revealed={revealed} revealDelay={index * 0.1} compact={compact} />)}</group>
      </Float>
    </>
  );
}

export default function SkillAtlas({ skills, notes, onSave, onOpen, revealed }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hoverTimer = useRef<number | null>(null);
  const parallaxFrame = useRef<number | null>(null);
  const shell = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const activeSkill = skills[activeIndex];
  const [draft, setDraft] = useState("");
  const activeNote = notes[activeSkill.id];

  useEffect(() => setDraft(notes[activeSkill.id]?.text || ""), [activeSkill.id, notes]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px), (pointer: coarse)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const previous = () => setActiveIndex((index) => (index - 1 + skills.length) % skills.length);
  const next = () => setActiveIndex((index) => (index + 1) % skills.length);
  const activateAfterHover = (index: number) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    if (index === activeIndex) {
      hoverTimer.current = null;
      return;
    }
    hoverTimer.current = window.setTimeout(() => {
      setActiveIndex(index);
      hoverTimer.current = null;
    }, 220);
  };

  useEffect(() => () => { if (hoverTimer.current) window.clearTimeout(hoverTimer.current); }, []);

  useEffect(() => () => { if (parallaxFrame.current) window.cancelAnimationFrame(parallaxFrame.current); }, []);

  const moveEnvironment = (event: ReactMouseEvent<HTMLDivElement>) => {
    const element = shell.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
    if (parallaxFrame.current) window.cancelAnimationFrame(parallaxFrame.current);
    parallaxFrame.current = window.requestAnimationFrame(() => {
      element.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
      element.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      parallaxFrame.current = null;
    });
  };

  const resetEnvironment = () => {
    if (parallaxFrame.current) window.cancelAnimationFrame(parallaxFrame.current);
    shell.current?.style.setProperty("--parallax-x", "0px");
    shell.current?.style.setProperty("--parallax-y", "0px");
    parallaxFrame.current = null;
  };

  return (
    <div className="mt-10">
      <div ref={shell} onMouseMove={compact ? undefined : moveEnvironment} onMouseLeave={compact ? undefined : resetEnvironment} style={{ "--parallax-x": "0px", "--parallax-y": "0px" } as CSSProperties} className="skill-carousel-shell relative overflow-hidden rounded-[1.5rem] border border-sky-100/20 bg-[#061222] sm:rounded-[2rem]">
        <Canvas shadows={!compact} dpr={compact ? [1, 1.2] : [1, 1.8]} camera={{ position: [0, 0, compact ? 9.4 : 8.5], fov: compact ? 42 : 38 }} style={{ height: compact ? "400px" : "clamp(430px, 52vw, 520px)" }} className="w-full cursor-grab active:cursor-grabbing">
          <Scene skills={skills} activeIndex={activeIndex} onSelect={setActiveIndex} onHover={activateAfterHover} onOpen={onOpen} revealed={revealed} compact={compact} />
        </Canvas>
        <div className="skill-carousel-hud pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 text-[8px] tracking-[.12em] text-sky-100/65 sm:p-5 sm:text-[10px] sm:tracking-[.16em]"><span className="flex items-center gap-1.5 sm:gap-2"><MousePointer2 size={12} /> {compact ? "TAP TO SELECT" : "MOVE TO EXPLORE DEPTH"}</span><span>REAL 3D / Z-AXIS</span></div>
        <div className="skill-carousel-hud absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-4 sm:p-5"><button aria-label="Previous skill" onClick={previous} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-[#061a31]/65 text-white backdrop-blur-md transition hover:scale-105 hover:border-sky-100 hover:bg-sky-100 hover:text-[#06204a]"><ArrowLeft size={17} /></button><div className="flex gap-2 rounded-full border border-white/10 bg-[#041325]/50 px-3 py-2 backdrop-blur-md">{skills.map((skill, index) => <button key={skill.id} onClick={() => setActiveIndex(index)} aria-label={`Go to ${skill.title}`} className={`h-2 min-w-2 rounded-full transition-[width,background-color] duration-200 ${index === activeIndex ? "w-7 bg-sky-100" : "w-2 bg-sky-100/35 hover:bg-sky-100/70"}`} />)}</div><button aria-label="Next skill" onClick={next} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-[#061a31]/65 text-white backdrop-blur-md transition hover:scale-105 hover:border-sky-100 hover:bg-sky-100 hover:text-[#06204a]"><ArrowRight size={17} /></button></div>
      </div>
      <AnimatePresence mode="wait"><motion.article key={activeSkill.id} initial={{ opacity: 0, transform: "translateY(12px) scale(.98)" }} animate={{ opacity: 1, transform: "translateY(0) scale(1)" }} exit={{ opacity: 0, transform: "translateY(-8px) scale(.98)" }} transition={{ duration: .2, ease: [0.23, 1, 0.32, 1] }} className="mt-5 rounded-2xl border border-sky-100/15 bg-sky-200/[.04] p-5 backdrop-blur-sm md:p-7"><p className="text-[10px] tracking-[.15em] text-sky-300">{activeSkill.number} / ABSTRACT</p><h3 className="mt-3 text-[1.65rem] font-medium leading-[1.05] tracking-[-.05em] text-sky-50 md:text-3xl">{activeSkill.title}</h3><p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-sky-50/65 md:text-base">{activeSkill.summary}</p><Link href={activeSkill.href} className="mt-6 inline-flex min-h-11 items-center rounded-full border border-sky-100/30 px-4 py-2 text-[10px] tracking-[.14em] text-sky-100 transition hover:border-sky-100 hover:bg-sky-100 hover:text-[#06204a]">OPEN DETAIL ↗</Link></motion.article></AnimatePresence>
      <div className="mt-5 rounded-2xl border border-sky-100/15 bg-sky-200/[.04] p-5 backdrop-blur-sm md:p-7"><div className="flex flex-col justify-between gap-3 border-b border-sky-100/15 pb-5 md:flex-row md:items-center"><div><p className="text-[10px] tracking-[.12em] text-sky-300 sm:tracking-[.15em]">{activeSkill.number} / {activeSkill.title.toUpperCase()} / NOTES</p><p className="mt-1 text-sm text-sky-50/50">添加你自己的学习笔记与案例。</p></div><span className="text-[10px] tracking-[.1em] text-sky-50/45">{activeNote?.updatedAt ? `UPDATED ${activeNote.updatedAt}` : "NEW NOTE"}</span></div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={6} placeholder={activeSkill.placeholder} className="mt-5 w-full resize-y rounded-xl border border-sky-100/15 bg-[#020914]/80 p-4 text-base leading-relaxed text-sky-50 outline-none placeholder:text-sky-100/25 focus:border-sky-300 focus:shadow-[0_0_24px_rgba(125,211,252,.18)]" /><button onClick={() => onSave(activeSkill.id, draft)} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-sky-100 px-5 py-3 text-[10px] font-semibold tracking-[.13em] text-[#06204a] transition hover:scale-105 hover:shadow-[0_0_25px_rgba(186,230,253,.45)]">{activeNote?.text ? "UPDATE NOTE ↗" : "SAVE NOTE ↗"}</button></div>
    </div>
  );
}
