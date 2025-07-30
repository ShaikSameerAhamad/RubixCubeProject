import React, { useState } from 'react';
import { RubiksCube, INITIAL_STATE } from '@/components/RubiksCube';
import ControlPanel from '@/components/ControlPanel';
import StepNavigation from '@/components/StepNavigation';
import CubeInput from '@/components/CubeInput';
import CameraInput from '@/components/CameraInput';
import CubeStats from '@/components/CubeStats';
import ErrorBoundary from '@/components/ErrorBoundary';
import HelpDialog from '@/components/HelpDialog';
import { Button } from '@/components/ui/button';
import { useCubeSolver } from '@/hooks/useCubeSolver';
import { useCubeContext } from '@/components/CubeContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const Index = () => {
  const [activeView, setActiveView] = useState<'solver' | 'input' | 'camera'>('solver');
  const { cubeState, setCubeState } = useCubeContext();
  const {
    cubeState: solverCubeState,
    setCubeState: setSolverCubeState,
    solutionMoves,
    currentStep,
    isLoading,
    isPlaying,
    solve,
    reset,
    nextStep,
    prevStep,
    togglePlayPause,
    totalSteps,
    currentMove,
  } = useCubeSolver();

  const handleCubeSubmit = (cubeConfig: any) => {
    setCubeState(cubeConfig);
    setSolverCubeState(cubeConfig);
    setActiveView('solver');
  };

  const toggleView = () => {
    const views: Array<'solver' | 'input' | 'camera'> = ['solver', 'input', 'camera'];
    const currentIndex = views.indexOf(activeView);
    const nextIndex = (currentIndex + 1) % views.length;
    setActiveView(views[nextIndex]);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSolve: solve,
    onReset: reset,
    onNextStep: nextStep,
    onPrevStep: prevStep,
    onPlayPause: togglePlayPause,
    onToggleView: toggleView,
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        {/* Header */}
        <header className="w-full py-6 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              3D Rubik's Cube Solver
            </h1>
            <div className="flex items-center justify-center gap-4">
              <p className="text-muted-foreground text-lg">
                Interactive 3D solver with step-by-step visualization
              </p>
              <HelpDialog />
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                variant={activeView === 'solver' ? 'default' : 'outline'}
                onClick={() => setActiveView('solver')}
              >
                3D Solver
              </Button>
              <Button
                variant={activeView === 'input' ? 'default' : 'outline'}
                onClick={() => setActiveView('input')}
              >
                Manual Input
              </Button>
              <Button
                variant={activeView === 'camera' ? 'default' : 'outline'}
                onClick={() => setActiveView('camera')}
              >
                Camera Input
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 pb-8">
          {activeView === 'solver' ? (
            <div className="space-y-8">
              {/* 3D Cube Display */}
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <RubiksCube 
                    cubeState={solverCubeState} 
                    isAnimating={isLoading}
                  />
                </div>
              </div>

              {/* Control Panel */}
              <ControlPanel
                onSolve={solve}
                onReset={reset}
                isLoading={isLoading}
                currentStep={currentStep + 1}
                totalSteps={totalSteps}
              />

              {/* Cube Statistics */}
              {totalSteps > 0 && (
                <CubeStats
                  totalSteps={totalSteps}
                  currentStep={currentStep}
                  isComplete={currentStep === totalSteps - 1}
                />
              )}

              {/* Step Navigation */}
              <StepNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onPrevStep={prevStep}
                onNextStep={nextStep}
                onPlayPause={togglePlayPause}
                isPlaying={isPlaying}
                currentMove={currentMove}
                solutionMoves={solutionMoves}
              />

              {/* Info Section */}
              <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
                <p className="mb-2">
                  <strong>How to use:</strong> Configure your cube using Manual Input or Camera Input, 
                  then click "Solve" to see the solution. Use the step controls to navigate through moves.
                </p>
                <p>
                  Drag to rotate the 3D view • Scroll to zoom • Camera detects colors automatically
                </p>
              </div>
            </div>
          ) : activeView === 'input' ? (
            <CubeInput onSubmit={handleCubeSubmit} />
          ) : (
            <CameraInput onSubmit={handleCubeSubmit} />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
