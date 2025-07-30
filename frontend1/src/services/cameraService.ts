// Service for camera operations and color detection
// This can be extended with your own computer vision backend

export type ColorKey = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green' | 'none';

export interface ColorDetectionResult {
  colors: ColorKey[];
  confidence: number[];
  timestamp: number;
}

export interface CameraConfig {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
  frameRate?: number;
}

class CameraService {
  private stream: MediaStream | null = null;

  // Start camera with configuration
  async startCamera(config: CameraConfig = { width: 640, height: 480, facingMode: 'environment' }): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: config.width,
          height: config.height,
          facingMode: config.facingMode,
          frameRate: config.frameRate || 30
        }
      });
      return this.stream;
    } catch (error) {
      console.error('Camera access failed:', error);
      throw new Error('Unable to access camera. Please check permissions.');
    }
  }

  // Stop camera stream
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Basic color detection (can be replaced with advanced CV backend)
  detectColors(imageData: ImageData): ColorKey[] {
    const colors: ColorKey[] = [];
    const gridSize = 3;
    const cellWidth = imageData.width / gridSize;
    const cellHeight = imageData.height / gridSize;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = Math.floor(col * cellWidth + cellWidth / 2);
        const y = Math.floor(row * cellHeight + cellHeight / 2);
        
        const index = (y * imageData.width + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];

        const detectedColor = this.detectCubeColor(r, g, b);
        colors.push(detectedColor);
      }
    }

    return colors;
  }

  // Advanced color detection with backend integration
  async detectColorsAdvanced(imageData: ImageData): Promise<ColorDetectionResult> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
    const formData = new FormData();
    formData.append('image', blob);
    const response = await fetch('/api/detect-colors', {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  // Advanced color detection with backend OpenCV
  async detectColorsWithBackend(imageData: ImageData, face: string): Promise<string[]> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
    const formData = new FormData();
    formData.append('file', blob, 'face.jpg');
    formData.append('face', face);
    const response = await fetch('/api/process-face', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.colors;
  }

  // Simple RGB-based color detection
  private detectCubeColor(r: number, g: number, b: number): ColorKey {
    const colors = [
      { key: 'white' as ColorKey, rgb: [255, 255, 255], tolerance: 80 },
      { key: 'yellow' as ColorKey, rgb: [255, 215, 0], tolerance: 60 },
      { key: 'red' as ColorKey, rgb: [255, 48, 48], tolerance: 60 },
      { key: 'orange' as ColorKey, rgb: [255, 140, 0], tolerance: 60 },
      { key: 'blue' as ColorKey, rgb: [0, 102, 255], tolerance: 60 },
      { key: 'green' as ColorKey, rgb: [0, 204, 0], tolerance: 60 },
    ];

    let bestMatch: ColorKey = 'white';
    let minDistance = Infinity;

    colors.forEach(({ key, rgb, tolerance }) => {
      const distance = Math.sqrt(
        Math.pow(r - rgb[0], 2) + 
        Math.pow(g - rgb[1], 2) + 
        Math.pow(b - rgb[2], 2)
      );

      if (distance < tolerance && distance < minDistance) {
        minDistance = distance;
        bestMatch = key;
      }
    });

    return bestMatch;
  }

  // Check camera availability
  async checkCameraAvailability(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  }

  // Get available cameras
  async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export const cameraService = new CameraService();