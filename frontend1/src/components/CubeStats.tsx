import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Zap, Puzzle } from 'lucide-react';

interface CubeStatsProps {
  totalSteps: number;
  currentStep: number;
  estimatedTime?: number;
  difficulty?: string;
  isComplete?: boolean;
}

const CubeStats: React.FC<CubeStatsProps> = ({
  totalSteps,
  currentStep,
  estimatedTime,
  difficulty,
  isComplete
}) => {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Puzzle className="w-5 h-5" />
          Solution Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Current Step */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <Target className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Step</p>
            <p className="text-lg font-semibold">
              {currentStep} / {totalSteps}
            </p>
          </div>

          {/* Total Moves */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <Zap className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Total Moves</p>
            <p className="text-lg font-semibold">{totalSteps}</p>
          </div>

          {/* Estimated Time */}
          {estimatedTime && (
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Est. Time</p>
              <p className="text-lg font-semibold">{estimatedTime}s</p>
            </div>
          )}

          {/* Difficulty */}
          {difficulty && (
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center">
                <Badge 
                  variant={
                    difficulty === 'Easy' ? 'default' : 
                    difficulty === 'Medium' ? 'secondary' : 'destructive'
                  }
                >
                  {difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Difficulty</p>
            </div>
          )}
        </div>

        {/* Completion Status */}
        {isComplete && (
          <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-primary font-medium">🎉 Cube Solved!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Completed in {currentStep} steps
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CubeStats;