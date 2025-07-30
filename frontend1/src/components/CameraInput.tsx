import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Square, RefreshCw } from 'lucide-react';
import { CUBE_COLORS, CUBE_FACES } from '@/components/CubeInput';
import { useCubeContext } from '@/components/CubeContext';
import { cameraService, type ColorKey } from '@/services/cameraService';
import LoadingSpinner from '@/components/LoadingSpinner';

type FaceId = typeof CUBE_FACES[number]['id'];

interface CameraInputProps {
  onSubmit?: (cubeState: Record<FaceId, ColorKey[]>) => void;
}

const CameraInput: React.FC<CameraInputProps> = ({ onSubmit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cubeState, setCubeState } = useCubeContext();
  const [currentFace, setCurrentFace] = useState<FaceId>('F');
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectedColors, setDetectedColors] = useState<ColorKey[]>([]);

  // Initialize camera using service
  const startCamera = useCallback(async () => {
    try {
      const stream = await cameraService.startCamera({
        width: 640,
        height: 480,
        facingMode: 'environment'
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  }, []);

  // Stop camera using service
  const stopCamera = useCallback(() => {
    cameraService.stopCamera();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Capture and analyze frame
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsCapturing(true);

    // Set canvas size to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw current video frame
    ctx.drawImage(videoRef.current, 0, 0);

    // Get full frame image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Use backend for detection
    try {
      const colors = await cameraService.detectColorsWithBackend(imageData, currentFace);
      setDetectedColors(colors);
    } catch (e) {
      alert('Failed to detect colors using backend.');
      setDetectedColors([]);
    }
    setIsCapturing(false);
  }, [currentFace]);

  // Apply detected colors to current face
  const applyColors = useCallback(() => {
    if (detectedColors.length !== 9) return;

    setCubeState(prev => ({
      ...prev,
      [currentFace]: [...detectedColors]
    }));

    setDetectedColors([]);
  }, [detectedColors, currentFace, setCubeState]);

  // Submit cube configuration
  const handleSubmit = useCallback(() => {
    const allTiles = Object.values(cubeState).flat();
    const colorCounts = allTiles.reduce((acc, color) => {
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {} as Record<ColorKey, number>);

    const isValid = Object.entries(colorCounts)
      .filter(([color]) => color !== 'none')
      .every(([, count]) => count === 9);

    if (!isValid) {
      alert('Invalid cube configuration. Each color must appear exactly 9 times.');
      return;
    }

    stopCamera();
    onSubmit?.(cubeState);
  }, [cubeState, onSubmit, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" />
            Camera Color Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Face Selection */}
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

          {/* Camera Feed */}
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {!cameraActive ? (
                <Button onClick={startCamera} className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="outline" className="flex items-center gap-2">
                  Stop Camera
                </Button>
              )}
            </div>

            {cameraActive && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-md rounded-lg border-2 border-muted"
                  />
                  {/* Grid overlay */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-2 border-white/70 rounded"
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={captureFrame}
                  disabled={isCapturing}
                  className="flex items-center gap-2"
                >
                  {isCapturing ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {isCapturing ? 'Analyzing...' : `Capture ${currentFace} Face`}
                </Button>
              </div>
            )}
          </div>

          {/* Detected Colors Preview */}
          {detectedColors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Detected Colors</h3>
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-1 p-4 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                  {detectedColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 border-2 border-background rounded-md"
                      style={{ backgroundColor: CUBE_COLORS[color]?.color || '#CCCCCC' }}
                      title={CUBE_COLORS[color]?.name || 'Unknown'}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <Button onClick={applyColors} className="flex items-center gap-2">
                  Apply to {currentFace} Face
                </Button>
                <Button onClick={() => setDetectedColors([])} variant="outline">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Current Cube State */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Current Cube State</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CUBE_FACES.map(face => {
                const faceColors = cubeState[face.id];
                const isComplete = faceColors.every(color => color !== 'none');
                
                return (
                  <div key={face.id} className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium">{face.id}</span>
                      <Badge variant={isComplete ? "default" : "secondary"}>
                        {isComplete ? "✓" : "..."}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-0.5 w-16 h-16 mx-auto">
                      {faceColors.map((color, i) => (
                        <div
                          key={i}
                          className="border border-background rounded-sm"
                          style={{ backgroundColor: CUBE_COLORS[color]?.color || '#CCCCCC' }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
              disabled={(() => {
                const allTiles = Object.values(cubeState).flat();
                const colorCounts = allTiles.reduce((acc, color) => {
                  acc[color] = (acc[color] || 0) + 1;
                  return acc;
                }, {} as Record<ColorKey, number>);
                
                return !Object.entries(colorCounts)
                  .filter(([color]) => color !== 'none')
                  .every(([, count]) => count === 9);
              })()}
            >
              Submit Cube Configuration
            </Button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraInput;