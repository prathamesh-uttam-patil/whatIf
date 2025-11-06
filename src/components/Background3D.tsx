import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Suspense } from 'react';

function Icosahedron() {
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={0.5}
    >
      <mesh>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial 
          color="#a855f7" 
          wireframe 
          opacity={0.12} 
          transparent 
        />
      </mesh>
    </Float>
  );
}

function FloatingOrbs() {
  const positions: [number, number, number][] = [
    [-2, 1, -2],
    [2, -1, -1],
    [-1, -2, -3],
    [3, 2, -2],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <Float
          key={i}
          speed={1 + i * 0.3}
          rotationIntensity={0.2}
          floatIntensity={0.8}
        >
          <mesh position={pos}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial 
              color="#8b5cf6" 
              opacity={0.1} 
              transparent 
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          style={{ background: 'transparent' }}
        >
          <Icosahedron />
          <FloatingOrbs />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </Suspense>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
