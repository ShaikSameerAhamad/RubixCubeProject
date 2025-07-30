import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  currentMove: string;
  solutionMoves: string[];
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  onPlayPause,
  isPlaying,
  currentMove,
  solutionMoves,
}) => {
  if (totalSteps === 0) return null;

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4 space-y-4">
        {/* Current Move Display */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Current Move</p>
          <p className="text-2xl font-bold text-primary">
            {currentMove || 'No move'}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={onPrevStep}
            disabled={currentStep <= 0}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            onClick={onPlayPause}
            variant="default"
            size="sm"
            className="w-10 h-10 p-0"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button
            onClick={onNextStep}
            disabled={currentStep >= totalSteps - 1}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {currentStep + 1}</span>
            <span>{totalSteps} total</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Solution Moves Preview */}
        {solutionMoves.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Solution Sequence</p>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {solutionMoves.map((move, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStep
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {move}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StepNavigation;