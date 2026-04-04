'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function NeuralNodes() {
  const pointsRef = useRef();
  
  const particles = useMemo(() => {
    const temp = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      temp.set([x, y, z], i * 3);
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    pointsRef.current.rotation.x -= delta / 10;
    pointsRef.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f2ff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Dynamic connection lines */}
      {[...Array(50)].map((_, i) => (
        <Connection key={i} />
      ))}
    </group>
  );
}

function Connection() {
  const lineRef = useRef();
  const start = useMemo(() => new THREE.Vector3().randomDirection().multiplyScalar(5), []);
  const end = useMemo(() => new THREE.Vector3().randomDirection().multiplyScalar(5), []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    lineRef.current.material.opacity = Math.sin(time + start.x) * 0.4 + 0.5;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#00f2ff" transparent opacity={0.3} />
    </line>
  );
}

export default function NeuralNetworkVisualization() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#020710']} />
        <NeuralNodes />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f2ff" />
      </Canvas>
    </div>
  );
}
