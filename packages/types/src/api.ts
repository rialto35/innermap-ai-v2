/**
 * API Request/Response Types
 */

import type { Answer, ResultSnapshot, Report } from '@innermap/engine';

// ===== Assessment API =====
export interface AssessRequest {
  answers: Answer[];
  testType?: 'lite' | 'full';
}

export interface AssessResponse {
  assessmentId: string;
  resultId: string;
  result: ResultSnapshot;
}

// ===== Report API =====
export interface ReportRequest {
  resultId: string;
  regenerate?: boolean;
}

export interface ReportResponse {
  reportId: string;
  status: 'queued' | 'running' | 'ready' | 'failed';
  report?: Report;
}

export interface ReportStatusResponse {
  reportId: string;
  status: 'queued' | 'running' | 'ready' | 'failed';
  progress?: number; // 0-100
  report?: Report;
  error?: string;
}

// ===== Results API =====
export interface ResultsListResponse {
  results: ResultSnapshot[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}

// ===== Export API =====
export interface ExportRequest {
  resultIds: string[];
  format: 'json' | 'pdf' | 'image';
  includeReports?: boolean;
}

export interface ExportResponse {
  exportId: string;
  downloadUrl: string;
  expiresAt: string;
}

// ===== Error Response =====
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

