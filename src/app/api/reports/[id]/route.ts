/**
 * GET /api/reports/:id?include=deep
 * 단일 리포트 조회 (요약 또는 심층 포함)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import type { ReportV1 } from '@/types/report';

const DEFAULT_MODULES = {
  cognition: "pending",
  communication: "pending", 
  goal: "pending",
  relation: "pending",
  energy: "pending",
  growth: "pending",
} as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeDeep = searchParams.get('include') === 'deep';

    console.log('🔍 [API /reports/:id] Debug info:', {
      id,
      userEmail: session.user.email,
      includeDeep
    });

    // 리포트 기본 정보 조회 (RLS 우회를 위해 supabaseAdmin 사용)
    const { data: report, error: reportError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    // 수동으로 권한 확인
    if (report && report.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (reportError || !report) {
      console.log('⚠️ [API /reports/:id] Report not found in reports table. Trying results fallback...', { reportError });

      const { data: resultRow, error: resultError } = await supabaseAdmin
        .from('results')
        .select('*')
        .eq('id', id)
        .single();

      if (resultError || !resultRow) {
        console.log('❌ [API /reports/:id] Not found in results fallback either:', { resultError });
        return NextResponse.json({ error: 'Report not found' }, { status: 404 });
      }

      // 결과 스냅샷을 ReportV1로 변환 (fallback)
      const mapBig5 = (b: any) => ({
        o: b?.O ?? b?.o ?? 0,
        c: b?.C ?? b?.c ?? 0,
        e: b?.E ?? b?.e ?? 0,
        a: b?.A ?? b?.a ?? 0,
        n: b?.N ?? b?.n ?? 0,
      });

      const inner9Arr = (() => {
        const rec = resultRow.inner9_scores as Record<string, number> | null;
        if (!rec) return [] as Array<{ label: string; value: number }>;
        return Object.entries(rec).map(([k, v]) => ({ label: k, value: Number(v) }));
      })();

      const fallback: ReportV1 = {
        id: resultRow.id,
        ownerId: (resultRow.user_id as any) ?? 'unknown',
        meta: {
          version: 'v1.3.1',
          engineVersion: resultRow.engine_version || 'IM-Core 1.3.1',
          weightsVersion: 'v1.3',
          generatedAt: resultRow.created_at || new Date().toISOString(),
        },
        scores: {
          big5: mapBig5(resultRow.big5_scores || {}),
          mbti: resultRow.mbti_scores?.type || 'XXXX',
          reti: resultRow.reti_scores?.score ?? 5,
          inner9: inner9Arr,
        },
        summary: {
          highlight: resultRow.analysis_text || '분석 결과를 확인해보세요.',
          bullets: ['분석 완료', '결과 확인 가능'],
        },
      };

      return NextResponse.json(fallback);
    }

    console.log('✅ [API /reports/:id] Report found:', {
      id: report.id,
      userId: report.user_id,
      userEmail: session.user.email,
      match: report.user_id === session.user.email
    });

    // 기본 ReportV1 객체 생성 (타입 주석 명시)
    const base: ReportV1 = {
      id: report.id,
      ownerId: report.user_id,
      meta: {
        version: "v1.3.1",
        engineVersion: report.engine_version || "IM-Core 1.3.1",
        weightsVersion: "v1.3",
        generatedAt: report.created_at
      },
      scores: {
        big5: report.big5_scores || { o: 0, c: 0, e: 0, a: 0, n: 0 },
        mbti: report.mbti_scores?.type || "XXXX",
        reti: report.reti_scores?.score || 5,
        inner9: report.inner9_scores || []
      },
      summary: {
        highlight: report.summary?.highlight || "분석 결과를 확인해보세요.",
        bullets: report.summary?.bullets || ["분석 완료", "결과 확인 가능"]
      }
    };

    // 심층 데이터 포함 요청 시
    let deepData = null;
    if (includeDeep) {
      const { data } = await supabaseAdmin
        .from('reports_deep')
        .select('*')
        .eq('report_id', id)
        .single();
      deepData = data;
    }

    // 불변 방식으로 최종 객체 생성
    const full: ReportV1 = deepData
      ? {
          ...base,
          deep: {
            modules: deepData.modules ?? DEFAULT_MODULES,
            narrative: deepData.narrative ?? null,
            resources: deepData.resources ?? {}
          }
        }
      : base;

    return NextResponse.json(full);

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
