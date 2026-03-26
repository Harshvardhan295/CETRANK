import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 800 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const light = useRef<THREE.PointLight>(null);

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      speeds[i] = 0.2 + Math.random() * 0.8;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, speeds, offsets };
  }, [count]);

  const sizes = useMemo(() => {
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizes[i] = 0.02 + Math.random() * 0.06;
    }
    return sizes;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    const positionsArr = mesh.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positionsArr[i3] += Math.sin(time * speeds[i] + offsets[i]) * 0.003;
      positionsArr[i3 + 1] += Math.cos(time * speeds[i] * 0.7 + offsets[i]) * 0.004;
      positionsArr[i3 + 2] += Math.sin(time * speeds[i] * 0.5 + offsets[i]) * 0.002;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = Math.sin(time * 0.1) * 0.05;

    if (light.current) {
      light.current.position.x = Math.sin(time * 0.3) * 5;
      light.current.position.y = Math.cos(time * 0.2) * 5;
    }
  });

  return (
    <>
      <pointLight ref={light} color="#7c3aed" intensity={2} distance={15} />
      <pointLight position={[5, 5, 5]} color="#3b82f6" intensity={1} distance={20} />
      <ambientLight intensity={0.1} />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#a78bfa"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    group.current.rotation.y = time * 0.05;
  });

  return (
    <group ref={group}>
      {[
        { pos: [3, 2, -2] as [number, number, number], color: "#7c3aed", scale: 0.8 },
        { pos: [-4, -1, -3] as [number, number, number], color: "#3b82f6", scale: 0.5 },
        { pos: [1, -3, -1] as [number, number, number], color: "#a78bfa", scale: 0.6 },
        { pos: [-2, 3, -4] as [number, number, number], color: "#06b6d4", scale: 0.4 },
      ].map((orb, i) => (
        <mesh key={i} position={orb.pos}>
          <sphereGeometry args={[orb.scale, 32, 32]} />
          <meshStandardMaterial
            color={orb.color}
            transparent
            opacity={0.08}
            emissive={orb.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <Particles count={600} />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
