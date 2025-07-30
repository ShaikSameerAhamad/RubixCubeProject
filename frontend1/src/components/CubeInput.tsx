import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCubeContext } from '@/components/CubeContext';

// Standard Rubik's Cube colors
export const CUBE_COLORS = {
  white: { name: 'White', color: '#FFFFFF', face: 'U' },
  yellow: { name: 'Yellow', color: '#FFD700', face: 'D' },
  red: { name: 'Red', color: '#FF3030', face: 'F' },
  orange: { name: 'Orange', color: '#FF8C00', face: 'B' },
  blue: { name: 'Blue', color: '#0066FF', face: 'L' },
  green: { name: 'Green', color: '#00CC00', face: 'R' },
  none: { name: 'Empty', color: '#CCCCCC', face: '' }, // Add empty color
} as const;

export const CUBE_FACES = [
  { id: 'U', name: 'Up (White)', defaultColor: 'white' },
  { id: 'D', name: 'Down (Yellow)', defaultColor: 'yellow' },
  { id: 'F', name: 'Front (Red)', defaultColor: 'red' },
  { id: 'B', name: 'Back (Orange)', defaultColor: 'orange' },
  { id: 'L', name: 'Left (Blue)', defaultColor: 'blue' },
  { id: 'R', name: 'Right (Green)', defaultColor: 'green' },
] as const;

type ColorKey = keyof typeof CUBE_COLORS;
type FaceId = typeof CUBE_FACES[number]['id'];

// Initialize cube state with all tiles empty
const initializeCubeState = (): Record<FaceId, ColorKey[]> => {
  const state: Record<FaceId, ColorKey[]> = {} as Record<FaceId, ColorKey[]>;
  CUBE_FACES.forEach(face => {
    state[face.id] = Array(9).fill('none');
  });
  return state;
};

interface CubeInputProps {
  onSubmit?: (cubeState: Record<FaceId, ColorKey[]>) => void;
}

const CubeInput: React.FC<CubeInputProps> = ({ onSubmit }) => {
  const { cubeState, setCubeState } = useCubeContext();
  const [currentFace, setCurrentFace] = useState<FaceId>('F');
  const [selectedColor, setSelectedColor] = useState<ColorKey>('white');
  const [animatingTile, setAnimatingTile] = useState<number | null>(null);

  // Count occurrences of each color across all faces
  const getColorCounts = useCallback(() => {
    const counts: Record<ColorKey, number> = {
      white: 0, yellow: 0, red: 0, orange: 0, blue: 0, green: 0, none: 0
    };
    
    Object.values(cubeState).forEach(face => {
      face.forEach(color => {
        counts[color]++;
      });
    });
    
    return counts;
  }, [cubeState]);

  const colorCounts = getColorCounts();

  const handleTileClick = (tileIndex: number) => {
    const currentTileColor = cubeState[currentFace][tileIndex];
    
    // If clicking on a tile that already has the selected color, do nothing
    if (currentTileColor === selectedColor) {
      return;
    }
    
    // Prevent assigning a color if it already has 9 tiles (ignore 'none')
    if (selectedColor !== 'none' && colorCounts[selectedColor] >= 9) {
      return;
    }

    // Animate the tile
    setAnimatingTile(tileIndex);
    setTimeout(() => setAnimatingTile(null), 200);

    // Update the cube state
    setCubeState(prev => ({
      ...prev,
      [currentFace]: prev[currentFace].map((color, index) => 
        index === tileIndex ? selectedColor : color
      )
    }));
    
    console.log('Updated cube state, color counts:', colorCounts);
  };

  const handleSubmit = () => {
    // Improved validation: every tile must be filled and each color (except 'none') must appear exactly 9 times
    const allTiles = Object.values(cubeState).flat();
    const isValid =
      allTiles.every(color => color !== 'none') &&
      Object.entries(colorCounts)
        .filter(([color]) => color !== 'none')
        .every(([, count]) => count === 9);
    if (!isValid) {
      alert('Invalid cube configuration. Each color must appear exactly 9 times and no tile can be empty.');
      return;
    }
    onSubmit?.(cubeState);
  };

  const resetCube = () => {
    setCubeState(initializeCubeState());
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Cube Face Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Palette */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Select Color</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(CUBE_COLORS).map(([key, colorInfo]) => {
                const isSelected = selectedColor === key;
                const count = colorCounts[key as ColorKey];
                const isMaxed = count >= 9;
                
                return (
                  <Button
                    key={key}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(key as ColorKey)}
                    className="relative flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    style={{
                      borderColor: isSelected ? colorInfo.color : undefined,
                      boxShadow: isSelected ? `0 0 0 2px ${colorInfo.color}40` : undefined,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded border-2 border-background"
                      style={{ backgroundColor: colorInfo.color }}
                    />
                    {colorInfo.name}
                    <Badge variant="secondary" className="text-xs">
                      {count}/9
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Face Navigation */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Current Face</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {CUBE_FACES.map(face => (
                <Button
                  key={face.id}
                  variant={currentFace === face.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentFace(face.id)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  {face.id} - {face.name}
                </Button>
              ))}
            </div>
          </div>

          {/* 3x3 Tile Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Face {currentFace} - {CUBE_FACES.find(f => f.id === currentFace)?.name}
            </h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-1 p-4 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                {cubeState[currentFace].map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleTileClick(index)}
                    className={`
                      w-12 h-12 sm:w-16 sm:h-16 border-2 border-background rounded-md 
                      transition-all duration-200 hover:scale-110 hover:shadow-lg
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      ${animatingTile === index ? 'animate-pulse scale-110' : ''}
                    `}
                    style={{
                      backgroundColor: CUBE_COLORS[color]?.color || '#CCCCCC',
                      boxShadow: animatingTile === index 
                        ? `0 0 20px ${CUBE_COLORS[color]?.color || '#CCCCCC'}80` 
                        : `0 2px 4px ${CUBE_COLORS[color]?.color || '#CCCCCC'}40`
                    }}
                    title={`Tile ${index + 1}: ${CUBE_COLORS[color]?.name || 'Empty'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button onClick={resetCube} variant="outline">
              Reset to Solved
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
              disabled={(() => {
                const allTiles = Object.values(cubeState).flat();
                return !(
                  allTiles.every(color => color !== 'none') &&
                  Object.entries(colorCounts)
                    .filter(([color]) => color !== 'none')
                    .every(([, count]) => count === 9)
                );
              })()}
            >
              Submit Cube Configuration
            </Button>
          </div>

          {/* Color Count Validation */}
          <div className="text-center text-xs text-muted-foreground">
            {(() => {
              const allTiles = Object.values(cubeState).flat();
              return allTiles.every(color => color !== 'none') &&
                Object.entries(colorCounts)
                  .filter(([color]) => color !== 'none')
                  .every(([, count]) => count === 9);
            })() ? (
              <span className="text-green-600 font-medium">✓ Valid cube configuration</span>
            ) : (
              <span className="text-orange-600">
                Each color must appear exactly 9 times and no tile can be empty. Current totals: {Object.entries(colorCounts).filter(([color]) => color !== 'none').map(([color, count]) => 
                  `${CUBE_COLORS[color as ColorKey].name}: ${count}`
                ).join(', ')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CubeInput;