import { useState, useCallback, useEffect } from 'react';
import { INITIAL_STATE } from '@/components/RubiksCube';
import { cubeApi, type SolutionResponse } from '@/services/cubeApi';

// Types
type CubeState = typeof INITIAL_STATE;
type Move = string;

// Apply moves to cube state (simplified for demo)
const applyMovesToCube = (cubeState: CubeState, moves: Move[]): CubeState => {
  // For demo purposes, return the same state
  // In a real implementation, this would apply actual cube rotations
  return cubeState;
};

export const useCubeSolver = () => {
  const [cubeState, setCubeState] = useState<CubeState>(INITIAL_STATE);
  const [solutionMoves, setSolutionMoves] = useState<Move[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || solutionMoves.length === 0) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= solutionMoves.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, solutionMoves.length]);

  // Removed scramble functionality

  const solve = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: SolutionResponse = await cubeApi.solveCube(cubeState);
      const moves = Array.isArray(response.solution)
        ? response.solution
        : typeof response.solution === 'string'
          ? response.solution.split(' ')
          : [];
      setSolutionMoves(moves);
      setCurrentStep(0);
    } catch (error) {
      console.error('Failed to solve cube:', error);
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
  }, [cubeState]);

  const reset = useCallback(() => {
    setCubeState(INITIAL_STATE);
    setSolutionMoves([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  // Removed custom scramble functionality

  const nextStep = useCallback(() => {
    if (currentStep < solutionMoves.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, solutionMoves.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return {
    cubeState,
    setCubeState,
    solutionMoves,
    currentStep,
    isLoading,
    isPlaying,
    solve,
    reset,
    nextStep,
    prevStep,
    togglePlayPause,
    totalSteps: solutionMoves.length,
    currentMove: solutionMoves[currentStep] || '',
  };
};