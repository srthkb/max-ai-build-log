"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const GRID = 65;
const COUNT = GRID * GRID;

type Particle = { x: number; z: number; radius: number; phase: number };

function Terrain() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo<Particle[]>(() => {
    const stepX = 7.6 / (GRID - 1);
    const stepZ = 5.8 / (GRID - 1);
    return Array.from({ length: COUNT }, (_, index) => {
      const column = index % GRID;
      const row = Math.floor(index / GRID);
      const x = -3.8 + column * stepX;
      const z = -2.9 + row * stepZ;
      return { x, z, radius: Math.hypot(x * 0.92, z), phase: x * 0.85 - z * 0.58 };
    });
  }, []);

  useFrame((state, delta) => {
    const particlesMesh = mesh.current;
    if (!particlesMesh) return;
    const time = state.clock.getElapsedTime();
    const pointerX = state.pointer.x * 3.7;
    const pointerZ = -state.pointer.y * 2.7;

    particles.forEach((particle, index) => {
      const radialWave = Math.sin(particle.radius * 4.1 - time * 1.15 + particle.phase * 0.35) * 0.11;
      const wideWave = Math.sin(particle.x * 1.35 + time * 0.52) * Math.cos(particle.z * 1.4 - time * 0.38) * 0.08;
      const vortex = -0.88 * Math.exp(-particle.radius * particle.radius * 1.12);
      const rim = 0.16 * Math.exp(-Math.pow(particle.radius - 2.4, 2) * 1.4);
      const mouseDistance = Math.hypot(particle.x - pointerX, particle.z - pointerZ);
      const mouseRipple = 0.18 * Math.exp(-mouseDistance * mouseDistance * 1.55) * Math.cos(mouseDistance * 7 - time * 3);
      const y = radialWave + wideWave + vortex + rim + mouseRipple;
      const scale = 0.037 + Math.max(0, y + 0.25) * 0.009;

      dummy.position.set(particle.x, y, particle.z);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      particlesMesh.setMatrixAt(index, dummy.matrix);
    });
    particlesMesh.instanceMatrix.needsUpdate = true;

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.14, 3.4, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.045, 3.4, delta);
    }
  });

  return (
    <group ref={group} rotation={[-0.02, 0, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color="#eaf0f8" roughness={0.3} metalness={0.72} />
      </instancedMesh>
    </group>
  );
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#030405"]} />
      <fog attach="fog" args={["#030405", 7.5, 15]} />
      <ambientLight intensity={1.3} color="#c9d6e8" />
      <directionalLight position={[-4, 7, 5]} intensity={3.4} color="#ffffff" />
      <pointLight position={[3, 2, 1]} intensity={8} distance={8} color="#b7c8db" />
      {reducedMotion ? <TerrainStill /> : <Terrain />}
    </>
  );
}

function TerrainStill() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!mesh.current) return;
    for (let index = 0; index < COUNT; index += 1) {
      const column = index % GRID;
      const row = Math.floor(index / GRID);
      const x = -3.8 + column * (7.6 / (GRID - 1));
      const z = -2.9 + row * (5.8 / (GRID - 1));
      const radius = Math.hypot(x * 0.92, z);
      const y = -0.88 * Math.exp(-radius * radius * 1.12) + 0.16 * Math.exp(-Math.pow(radius - 2.4, 2) * 1.4);
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.04);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}><sphereGeometry args={[1, 10, 10]} /><meshStandardMaterial color="#eaf0f8" roughness={0.3} metalness={0.72} /></instancedMesh>;
}

export default function ParticleTerrain() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return <div aria-hidden="true" className="particle-terrain"><Canvas dpr={[1, 1.5]} camera={{ position: [0, 4.25, 7.75], fov: 44, near: 0.1, far: 30 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} onCreated={({ camera }) => camera.lookAt(0, -0.1, 0)}><Scene reducedMotion={reducedMotion} /></Canvas></div>;
}
