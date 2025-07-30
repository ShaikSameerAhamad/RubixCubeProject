import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Keyboard, Camera, MousePointer } from 'lucide-react';

const HelpDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            How to Use Rubik's Cube Solver
          </DialogTitle>
          <DialogDescription>
            Learn how to configure and solve your Rubik's cube
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Methods */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Input Methods</h3>
            <div className="grid gap-4">
              <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <MousePointer className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Manual Input</h4>
                  <p className="text-sm text-muted-foreground">
                    Click on each tile to cycle through colors. Configure all 6 faces of the cube manually.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <Camera className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Camera Input</h4>
                  <p className="text-sm text-muted-foreground">
                    Use your camera to capture each face. Hold the cube steady and ensure good lighting for best results.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </h3>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Solve cube</span>
                <Badge variant="outline">Ctrl + Enter</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Reset cube</span>
                <Badge variant="outline">Ctrl + R</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Next step</span>
                <Badge variant="outline">→</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Previous step</span>
                <Badge variant="outline">←</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Play/Pause</span>
                <Badge variant="outline">Space</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Switch view</span>
                <Badge variant="outline">Shift + Tab</Badge>
              </div>
            </div>
          </section>

          {/* 3D Controls */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">3D Cube Controls</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Rotate view</span>
                <span className="text-muted-foreground">Click and drag</span>
              </div>
              <div className="flex justify-between">
                <span>Zoom in/out</span>
                <span className="text-muted-foreground">Mouse wheel</span>
              </div>
              <div className="flex justify-between">
                <span>Pan view</span>
                <span className="text-muted-foreground">Right click + drag</span>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Tips for Best Results</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Ensure each color appears exactly 9 times across all faces</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>For camera input, use good lighting and hold the cube steady</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Double-check your configuration before solving</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Use the step controls to learn the solving algorithms</span>
              </li>
            </ul>
          </section>

          {/* Color Guide */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Standard Cube Colors</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border rounded" />
                <span>White (Top)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded" />
                <span>Yellow (Bottom)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>Red (Right)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded" />
                <span>Orange (Left)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>Blue (Front)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Green (Back)</span>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;