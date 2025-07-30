import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface ControlPanelProps {
  onSolve: () => void;
  onReset: () => void;
  isLoading: boolean;
  currentStep: number;
  totalSteps: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onSolve,
  onReset,
  isLoading,
  currentStep,
  totalSteps,
}) => {
  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={onSolve}
            disabled={isLoading}
            variant="default"
            size="lg"
            className="min-w-24"
          >
            Solve Cube
          </Button>
          <Button
            onClick={onReset}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="min-w-24"
          >
            Reset
          </Button>
        </div>

        {/* Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Step</p>
            <p className="text-lg font-semibold text-foreground">
              {currentStep} / {totalSteps}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-lg font-semibold text-foreground">
              {isLoading ? 'Analyzing...' : totalSteps > 0 ? 'Solution Ready' : 'Configure Cube'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;