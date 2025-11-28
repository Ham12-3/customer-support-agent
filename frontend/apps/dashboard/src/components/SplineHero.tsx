'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, type RootState } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Rig() {
  useFrame((state: RootState) => {
    const target = new THREE.Vector3(state.pointer.x * 0.5, state.pointer.y * 0.5, 8);
    state.camera.position.lerp(target, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

interface GlassShapeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  geometry: THREE.BufferGeometry;
  color: string;
}

function GlassShape({ position, rotation, scale, geometry, color }: GlassShapeProps) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((_state: RootState, delta: number) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={1.5} // XYZ rotation intensity
      floatIntensity={2} // Up/down float intensity
    >
      <mesh ref={mesh} position={position} rotation={rotation} scale={scale} geometry={geometry}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          metalness={0.1}
          transmission={0.95} // Glass effect
          thickness={1.5} // Refraction
          ior={1.5} // Index of refraction
          clearcoat={1}
          attenuationDistance={0.5}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  // Memoize geometries to avoid recreating on every render
  const icosahedron = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const torus = useMemo(() => new THREE.TorusGeometry(1, 0.3, 16, 100), []);
  const octahedron = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const sphere = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

  return (
    <>
      <Rig />
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#4f46e5" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#e0e7ff" />
      
      {/* Main central shape */}
      <GlassShape 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]} 
        scale={[1.8, 1.8, 1.8]} 
        geometry={icosahedron} 
        color="#6366f1" 
      />
      
      {/* Floating surrounding shapes */}
      <GlassShape 
        position={[-3, 2, -2]} 
        rotation={[1, 0, 0]} 
        scale={[0.8, 0.8, 0.8]} 
        geometry={torus} 
        color="#a5b4fc" 
      />
      
      <GlassShape 
        position={[3, -1, -1]} 
        rotation={[0, 1, 0]} 
        scale={[1, 1, 1]} 
        geometry={octahedron} 
        color="#818cf8" 
      />

      <GlassShape 
        position={[-2, -2.5, 1]} 
        rotation={[0.5, 0.5, 0]} 
        scale={[0.6, 0.6, 0.6]} 
        geometry={sphere} 
        color="#4338ca" 
      />

      <Environment preset="city" />
      <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
    </>
  );
}

export function SplineHero() {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full">
      <Canvas dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}

