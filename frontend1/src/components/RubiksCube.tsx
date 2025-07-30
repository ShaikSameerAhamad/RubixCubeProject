import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useCubeContext } from '@/components/CubeContext';

// Standard Rubik's Cube colors
const CUBE_COLORS = {
  U: '#ffffff', // White (Up)
  D: '#ffff00', // Yellow (Down)
  F: '#ff0000', // Red (Front)
  B: '#ff8800', // Orange (Back)
  L: '#0000ff', // Blue (Left)
  R: '#00ff00', // Green (Right)
};

// Initial solved state
const INITIAL_STATE = {
  U: Array(9).fill('U'),
  D: Array(9).fill('D'),
  F: Array(9).fill('F'),
  B: Array(9).fill('B'),
  L: Array(9).fill('L'),
  R: Array(9).fill('R'),
};

// Add color name to face key mapping
const COLOR_TO_FACE = {
  white: 'U',
  yellow: 'D',
  red: 'F',
  orange: 'B',
  blue: 'L',
  green: 'R',
};

// Helper to map color names in cubeState to face keys for rendering
function mapCubeStateColorsToFaceKeys(cubeState: any) {
  const mapped: any = {};
  Object.keys(cubeState).forEach(face => {
    mapped[face] = cubeState[face].map(color => COLOR_TO_FACE[color] || color);
  });
  return mapped;
}

interface StickerProps {
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}

const Sticker: React.FC<StickerProps> = ({ position, color, rotation = [0, 0, 0] }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.28, 0.28]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

interface CubeFaceProps {
  face: string;
  colors: string[];
  facePosition: [number, number, number];
  faceRotation: [number, number, number];
}

const CubeFace: React.FC<CubeFaceProps> = ({ face, colors, facePosition, faceRotation }) => {
  const stickers = [];
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const x = (j - 1) * 0.33;
      const y = (1 - i) * 0.33;
      const z = 0.001;
      
      stickers.push(
        <Sticker
          key={`${face}-${index}`}
          position={[x, y, z]}
          color={CUBE_COLORS[colors[index] as keyof typeof CUBE_COLORS]}
        />
      );
    }
  }

  return (
    <group position={facePosition} rotation={faceRotation}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
      {stickers}
    </group>
  );
};

interface RubiksCubeProps {
  cubeState: typeof INITIAL_STATE;
  isAnimating: boolean;
}

const RubiksCube3D: React.FC<RubiksCubeProps> = ({ cubeState, isAnimating }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && isAnimating) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Front Face */}
      <CubeFace
        face="F"
        colors={cubeState.F}
        facePosition={[0, 0, 0.5]}
        faceRotation={[0, 0, 0]}
      />
      
      {/* Back Face */}
      <CubeFace
        face="B"
        colors={cubeState.B}
        facePosition={[0, 0, -0.5]}
        faceRotation={[0, Math.PI, 0]}
      />
      
      {/* Up Face */}
      <CubeFace
        face="U"
        colors={cubeState.U}
        facePosition={[0, 0.5, 0]}
        faceRotation={[-Math.PI / 2, 0, 0]}
      />
      
      {/* Down Face */}
      <CubeFace
        face="D"
        colors={cubeState.D}
        facePosition={[0, -0.5, 0]}
        faceRotation={[Math.PI / 2, 0, 0]}
      />
      
      {/* Left Face */}
      <CubeFace
        face="L"
        colors={cubeState.L}
        facePosition={[-0.5, 0, 0]}
        faceRotation={[0, -Math.PI / 2, 0]}
      />
      
      {/* Right Face */}
      <CubeFace
        face="R"
        colors={cubeState.R}
        facePosition={[0.5, 0, 0]}
        faceRotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
};

const RubiksCube: React.FC<{ cubeState?: any; isAnimating: boolean }> = ({ cubeState: propCubeState, isAnimating }) => {
  const { cubeState: contextCubeState } = useCubeContext();
  const cubeState = propCubeState || contextCubeState;
  const mappedCubeState = mapCubeStateColorsToFaceKeys(cubeState);
  return (
    <div className="w-full h-96 bg-gradient-to-br from-background to-muted rounded-lg shadow-lg">
      <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <RubiksCube3D cubeState={mappedCubeState} isAnimating={isAnimating} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  );
};

export { RubiksCube, INITIAL_STATE, CUBE_COLORS };
export type { CubeFaceProps };