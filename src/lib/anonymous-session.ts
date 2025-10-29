/**
 * InnerMap AI - 비로그인 검사 시스템 설계
 * 세션 기반 익명 사용자 관리
 */

import { findOrCreateUser } from '@/lib/db/users';
import { supabaseAdmin } from '@/lib/supabase';

// =====================================================
// 1. 사용자 식별자 타입 정의
// =====================================================

export type UserIdentifier = 
  | {
      type: 'authenticated';
      userId: string; // UUID
      email: string;
    }
  | {
      type: 'anonymous';
      sessionId: string; // 임시 세션 ID
      deviceId?: string; // 디바이스 식별자 (선택사항)
    };

// =====================================================
// 2. 세션 관리 유틸리티
// =====================================================

export class AnonymousSessionManager {
  private static readonly SESSION_PREFIX = 'anon_';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24시간

  /**
   * 새로운 익명 세션 생성
   */
  static generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${this.SESSION_PREFIX}${timestamp}_${random}`;
  }

  /**
   * 세션 ID 유효성 검증
   */
  static isValidSessionId(sessionId: string): boolean {
    return sessionId.startsWith(this.SESSION_PREFIX);
  }

  /**
   * 세션 만료 시간 계산
   */
  static getExpirationTime(): Date {
    return new Date(Date.now() + this.SESSION_DURATION);
  }
}

// =====================================================
// 3. 사용자 식별자 해결 함수
// =====================================================

export async function resolveUserIdentifier(
  session: any,
  request?: Request
): Promise<UserIdentifier | null> {
  // 로그인 사용자
  if (session?.user?.email) {
    const user = await findOrCreateUser({
      email: session.user.email,
      provider: session.provider || 'google',
      providerId: session.providerId || '',
    });
    
    return {
      type: 'authenticated',
      userId: user.user?.id || '',
      email: session.user.email,
    };
  }

  // 비로그인 사용자 - 세션 ID 추출
  if (request) {
    const sessionId = extractSessionIdFromRequest(request);
    if (sessionId) {
      return {
        type: 'anonymous',
        sessionId,
      };
    }
  }

  return null;
}

/**
 * 요청에서 세션 ID 추출
 */
function extractSessionIdFromRequest(request: Request): string | null {
  // 1. 쿠키에서 추출
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const sessionMatch = cookieHeader.match(/anon_session=([^;]+)/);
    if (sessionMatch) {
      return sessionMatch[1];
    }
  }

  // 2. 헤더에서 추출
  const sessionHeader = request.headers.get('x-anon-session');
  if (sessionHeader) {
    return sessionHeader;
  }

  // 3. URL 파라미터에서 추출 (fallback)
  const url = new URL(request.url);
  const sessionParam = url.searchParams.get('session');
  if (sessionParam) {
    return sessionParam;
  }

  return null;
}

// =====================================================
// 4. 데이터베이스 스키마 확장
// =====================================================

/*
-- test_assessments 테이블 확장
ALTER TABLE public.test_assessments 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'authenticated' CHECK (user_type IN ('authenticated', 'anonymous')),
ADD COLUMN IF NOT EXISTS user_email TEXT, -- 로그인 사용자만
ADD COLUMN IF NOT EXISTS session_id TEXT, -- 비로그인 사용자만
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE; -- 비로그인 세션 만료시간

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_test_assessments_user_type ON public.test_assessments(user_type);
CREATE INDEX IF NOT EXISTS idx_test_assessments_session_id ON public.test_assessments(session_id);
CREATE INDEX IF NOT EXISTS idx_test_assessments_expires_at ON public.test_assessments(expires_at);

-- 뷰 업데이트
CREATE OR REPLACE VIEW public.test_results_with_catalog AS
SELECT
  ta.id,
  ta.user_id,
  ta.user_type,
  ta.user_email,
  ta.session_id,
  ta.expires_at,
  'imcore' as test_type,
  COALESCE(up.email, ta.user_email, 'anonymous') as name,
  up.birthdate as birth_date,
  COALESCE(up.gender, 'male') as gender_preference,
  tar.mbti as mbti_type,
  jsonb_build_object() as mbti_confidence,
  'r5' as reti_top1,
  NULL as reti_top2,
  jsonb_build_object() as reti_scores,
  COALESCE((tar.big5->>'O')::numeric * 100, 50)::integer as big5_openness,
  COALESCE((tar.big5->>'C')::numeric * 100, 50)::integer as big5_conscientiousness,
  COALESCE((tar.big5->>'E')::numeric * 100, 50)::integer as big5_extraversion,
  COALESCE((tar.big5->>'A')::numeric * 100, 50)::integer as big5_agreeableness,
  COALESCE((tar.big5->>'N')::numeric * 100, 50)::integer as big5_neuroticism,
  50 as growth_innate,
  50 as growth_acquired,
  50 as growth_conscious,
  50 as growth_unconscious,
  50 as growth_growth,
  50 as growth_stability,
  50 as growth_harmony,
  50 as growth_individual,
  tar.hero_code as hero_id,
  hc.canonical_name as hero_name,
  tc.canonical_name as tribe_name,
  tc.name_en as tribe_name_en,
  sc.canonical_name as stone_name,
  ta.raw_answers as raw_scores,
  ta.created_at,
  ta.created_at as updated_at
FROM public.test_assessments ta
LEFT JOIN public.test_assessment_results tar ON ta.id = tar.assessment_id
LEFT JOIN public.user_profiles up ON ta.user_id = up.user_id AND ta.user_type = 'authenticated'
LEFT JOIN public.hero_catalog hc ON tar.hero_code = hc.code
LEFT JOIN public.tribe_catalog tc ON tar.tribe_code = tc.code
LEFT JOIN public.stone_catalog sc ON tar.stone_code = sc.code;
*/

// =====================================================
// 5. API 수정 예시
// =====================================================

/*
// /api/test/analyze 수정 예시
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userIdentifier = await resolveUserIdentifier(session, req);
  
  if (!userIdentifier) {
    return NextResponse.json({ error: 'USER_IDENTIFICATION_FAILED' }, { status: 400 });
  }

  let userId: string;
  let userType: 'authenticated' | 'anonymous';
  let userEmail: string | null = null;
  let sessionId: string | null = null;
  let expiresAt: Date | null = null;

  if (userIdentifier.type === 'authenticated') {
    userId = userIdentifier.userId;
    userType = 'authenticated';
    userEmail = userIdentifier.email;
  } else {
    userId = userIdentifier.sessionId; // 세션 ID를 user_id로 사용
    userType = 'anonymous';
    sessionId = userIdentifier.sessionId;
    expiresAt = AnonymousSessionManager.getExpirationTime();
  }

  // DB 저장
  const { data: assess } = await supabaseAdmin
    .from("test_assessments")
    .insert({
      user_id: userId,
      user_type: userType,
      user_email: userEmail,
      session_id: sessionId,
      expires_at: expiresAt,
      engine_version: engineVersion,
      raw_answers: answers,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();
}
*/

// =====================================================
// 6. 클라이언트 사이드 세션 관리
// =====================================================

export class ClientSessionManager {
  private static readonly SESSION_KEY = 'anon_session';

  /**
   * 클라이언트에서 세션 ID 생성/저장
   */
  static createSession(): string {
    const sessionId = AnonymousSessionManager.generateSessionId();
    localStorage.setItem(this.SESSION_KEY, sessionId);
    return sessionId;
  }

  /**
   * 저장된 세션 ID 가져오기
   */
  static getSessionId(): string | null {
    return localStorage.getItem(this.SESSION_KEY);
  }

  /**
   * 세션 ID를 요청 헤더에 추가
   */
  static addSessionToHeaders(headers: HeadersInit = {}): HeadersInit {
    const sessionId = this.getSessionId();
    if (sessionId) {
      return {
        ...headers,
        'x-anon-session': sessionId,
      };
    }
    return headers;
  }

  /**
   * 세션 정리
   */
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}

// =====================================================
// 7. 로그인 시 세션 병합
// =====================================================

export async function mergeAnonymousSessionToUser(
  sessionId: string,
  userId: string
): Promise<boolean> {
  try {
    // 익명 세션의 모든 검사 결과를 사용자 계정으로 이전
    const { error } = await supabaseAdmin
      .from('test_assessments')
      .update({
        user_id: userId,
        user_type: 'authenticated',
        session_id: null,
        expires_at: null,
      })
      .eq('session_id', sessionId)
      .eq('user_type', 'anonymous');

    if (error) {
      console.error('Failed to merge anonymous session:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error merging anonymous session:', error);
    return false;
  }
}
