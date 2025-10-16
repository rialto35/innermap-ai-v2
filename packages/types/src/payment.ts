/**
 * Payment & Plan Types
 */

export type PlanType = 'free' | 'premium' | 'pro';

export interface PlanFeatures {
  testType: 'lite' | 'full';
  reportsPerMonth: number;
  regenerateReports: boolean;
  shareLinks: boolean;
  pdfExport: boolean;
  imageExport: boolean;
  versionComparison: boolean;
  priorityProcessing: boolean;
  watermark: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    testType: 'lite',
    reportsPerMonth: 0,
    regenerateReports: false,
    shareLinks: false,
    pdfExport: false,
    imageExport: false,
    versionComparison: false,
    priorityProcessing: false,
    watermark: true
  },
  premium: {
    testType: 'full',
    reportsPerMonth: 1,
    regenerateReports: true,
    shareLinks: true,
    pdfExport: false,
    imageExport: false,
    versionComparison: false,
    priorityProcessing: false,
    watermark: false
  },
  pro: {
    testType: 'full',
    reportsPerMonth: Infinity,
    regenerateReports: true,
    shareLinks: true,
    pdfExport: true,
    imageExport: true,
    versionComparison: true,
    priorityProcessing: true,
    watermark: false
  }
};

export interface CheckoutRequest {
  plan: 'premium' | 'pro';
  billingPeriod: 'monthly' | 'yearly';
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponse {
  sessionId: string;
  checkoutUrl: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  created: number;
}

