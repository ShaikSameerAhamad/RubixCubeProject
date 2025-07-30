import React, { createContext, useContext, useState } from 'react';

// Types for cube state
export type FaceId = 'U' | 'D' | 'F' | 'B' | 'L' | 'R';
export type ColorKey = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green' | 'none';
export type CubeState = Record<FaceId, ColorKey[]>;

// Default empty cube state (all tiles 'none')
const defaultCubeState: CubeState = {
  U: Array(9).fill('none'),
  D: Array(9).fill('none'),
  F: Array(9).fill('none'),
  B: Array(9).fill('none'),
  L: Array(9).fill('none'),
  R: Array(9).fill('none'),
};

interface CubeContextType {
  cubeState: CubeState;
  setCubeState: React.Dispatch<React.SetStateAction<CubeState>>;
}

const CubeContext = createContext<CubeContextType | undefined>(undefined);

export const CubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cubeState, setCubeState] = useState<CubeState>(defaultCubeState);
  return (
    <CubeContext.Provider value={{ cubeState, setCubeState }}>
      {children}
    </CubeContext.Provider>
  );
};

export const useCubeContext = () => {
  const context = useContext(CubeContext);
  if (!context) {
    throw new Error('useCubeContext must be used within a CubeProvider');
  }
  return context;
}; 