/**
 * CrewAI Service Client
 * Handles communication with the CrewAI analysis microservice
 */

export interface CrewAIAnalysisRequest {
  userId: string;
  big5: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
  mbti?: string;
  inner9: {
    creation: number;
    will: number;
    insight: number;
    sensitivity: number;
    growth: number;
    balance: number;
    harmony: number;
    expression: number;
  };
  hero?: {
    code: string;
    title: string;
    tribe?: string;
  };
}

export interface CrewAIAnalysisResponse {
  success: boolean;
  analysis: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    growthAdvice: string;
    relationships: string;
    career: string;
  };
  metadata: {
    model: string;
    crewVersion: string;
    processingTime: number;
  };
}

/**
 * CrewAI Service Client
 */
class CrewAIClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_CREWAI_SERVICE_URL || 'http://localhost:8000';
    this.timeout = parseInt(process.env.NEXT_PUBLIC_CREWAI_TIMEOUT || '300000'); // 5 minutes
  }

  /**
   * Check if CrewAI service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout for health check
      });
      return response.ok;
    } catch (error) {
      console.error('[CrewAI] Service unavailable:', error);
      return false;
    }
  }

  /**
   * Run deep analysis using CrewAI
   * 
   * @param request - Analysis request data
   * @returns Analysis response
   */
  async analyze(request: CrewAIAnalysisRequest): Promise<CrewAIAnalysisResponse> {
    try {
      console.log('[CrewAI] Starting analysis request...');
      
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `CrewAI service returned ${response.status}`
        );
      }

      const data = await response.json();
      console.log('[CrewAI] Analysis completed successfully');
      
      return data;
    } catch (error) {
      console.error('[CrewAI] Analysis failed:', error);
      throw error;
    }
  }

  /**
   * Run analysis with fallback to OpenAI direct call
   * 
   * @param request - Analysis request data
   * @returns Analysis response
   */
  async analyzeWithFallback(
    request: CrewAIAnalysisRequest
  ): Promise<CrewAIAnalysisResponse> {
    try {
      // Try CrewAI service first
      return await this.analyze(request);
    } catch (error) {
      console.warn('[CrewAI] Falling back to direct OpenAI call');
      
      // Fallback to direct OpenAI call via Next.js API route
      const response = await fetch('/api/analysis/fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Both CrewAI and fallback analysis failed');
      }

      return await response.json();
    }
  }
}

// Singleton instance
export const crewAIClient = new CrewAIClient();

/**
 * Hook for using CrewAI analysis in React components
 */
export function useCrewAIAnalysis() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<CrewAIAnalysisResponse | null>(null);

  const analyze = React.useCallback(
    async (request: CrewAIAnalysisRequest) => {
      setLoading(true);
      setError(null);

      try {
        const result = await crewAIClient.analyzeWithFallback(request);
        setData(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { analyze, loading, error, data };
}

// Add React import for the hook
import React from 'react';

