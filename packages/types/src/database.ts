/**
 * Database Schema Types (Supabase)
 */

// ===== Users & Profiles =====
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  birth_date?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

// ===== Assessments =====
export interface DbAssessment {
  id: string;
  user_id: string;
  answers: Record<string, unknown>[]; // JSON array
  answers_hash: string;
  engine_version: string;
  test_type: 'lite' | 'full';
  created_at: string;
}

// ===== Results =====
export interface DbResult {
  id: string;
  user_id: string;
  assessment_id: string;
  engine_version: string;
  
  // Scores (JSON)
  big5_scores: Record<string, number>;
  mbti_scores: Record<string, unknown>;
  reti_scores: Record<string, unknown>;
  
  // Mappings (JSON)
  tribe: Record<string, unknown>;
  stone: Record<string, unknown>;
  hero: Record<string, unknown>;
  
  // Growth
  growth_vector?: Record<string, unknown>;
  
  created_at: string;
  expires_at?: string;
}

// ===== Reports =====
export interface DbReport {
  id: string;
  result_id: string;
  user_id: string;
  
  status: 'queued' | 'running' | 'ready' | 'failed';
  
  summary_md?: string;
  narrative_md?: string;
  visuals?: Record<string, unknown>;
  
  model_provider?: string;
  model_version?: string;
  prompt_version?: string;
  
  created_at: string;
  started_at?: string;
  completed_at?: string;
  
  error?: string;
}

// ===== Payments =====
export interface DbPayment {
  id: string;
  user_id: string;
  
  plan: 'free' | 'premium' | 'pro';
  status: 'active' | 'cancelled' | 'past_due';
  
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  
  current_period_start?: string;
  current_period_end?: string;
  
  created_at: string;
  updated_at: string;
}

// ===== Audit Logs =====
export interface DbAuditLog {
  id: string;
  user_id?: string;
  
  event_type: string; // e.g., 'assessment.created', 'report.generated'
  event_data: Record<string, unknown>;
  
  ip_address?: string;
  user_agent?: string;
  
  created_at: string;
}

// ===== Share Links =====
export interface DbShareLink {
  id: string;
  user_id: string;
  result_id: string;
  
  token: string;
  expires_at?: string;
  revoked_at?: string;
  
  view_count: number;
  max_views?: number;
  
  created_at: string;
  updated_at: string;
}

