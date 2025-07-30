// Service layer for cube-related API operations
// Replace these with your actual backend endpoints

export interface CubeState {
  U: string[];
  D: string[];
  F: string[];
  B: string[];
  L: string[];
  R: string[];
}

export interface SolutionResponse {
  moves: string[];
  totalSteps: number;
  estimatedTime?: number;
}

export interface CubeValidationResponse {
  isValid: boolean;
  errors?: string[];
}

class CubeApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // Validate cube configuration
  async validateCube(cubeState: CubeState): Promise<CubeValidationResponse> {
    const response = await fetch(`${this.baseUrl}/validate-cube`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cubeState })
    });
    return response.json();
  }

  // Solve cube and get solution steps
  async solveCube(cubeState: CubeState): Promise<SolutionResponse> {
    const response = await fetch(`${this.baseUrl}/solve-cube`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        faces: cubeState,
        size: 3
      })
    });
    const data = await response.json();
    // Convert backend response to SolutionResponse
    const movesArray = typeof data.solution === 'string' && data.solution.trim() !== ''
      ? data.solution.trim().split(' ')
      : [];
    return {
      moves: movesArray,
      totalSteps: data.stats?.moves ?? movesArray.length,
      estimatedTime: data.stats?.time
    };
  }

  // Analyze cube state for optimal solving algorithm
  async analyzeCube(cubeState: CubeState): Promise<{ difficulty: string; estimatedMoves: number }> {
    const response = await fetch(`${this.baseUrl}/analyze-cube`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cubeState })
    });
    return response.json();
  }
}

// Export singleton instance
export const cubeApi = new CubeApiService();