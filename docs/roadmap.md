# InnerMap AI v2 - Development Roadmap

## Product Vision

**한 줄**: "검사 → 해석 → 성장경로"를 1분 요약 + 심층 리포트까지 자동 제공하는 퍼스널 인사이트 웹앱.

**핵심 가치**:
- **재현 가능성**: 동일 답변 = 동일 결과
- **즉시성**: 요약은 즉시, 심층은 비동기
- **소유권**: 내 데이터는 내 계정에 저장·내보내기 가능

## Milestones

### M1 - Core MVP (2주) ✅ In Progress

**목표**: 기본 테스트 플로우와 결과 스냅샷 제공

- [x] PR #1: Scaffold (app routes + api skeleton + packages)
- [ ] PR #2: Engine v1 (scoring/mapping + tests)
- [ ] PR #3: Assessment API + auth guard
- [ ] Basic dashboard & results page
- [ ] Google login integration
- [ ] Supabase schema + RLS policies

**완료 조건**:
- 사용자가 테스트를 완료하고 즉시 결과를 볼 수 있음
- 결과는 재현 가능하며 엔진 버전이 기록됨
- 기본 인증 및 데이터 보안이 작동함

### M2 - Report & Monetization (2주)

**목표**: 비동기 리포트 생성 및 결제 시스템

- [ ] Report queue system (background jobs)
- [ ] LLM narrative generation (OpenAI/Anthropic)
- [ ] Share link with expiry
- [ ] Stripe integration (checkout + webhook)
- [ ] Plan limits enforcement
- [ ] Email notifications

**완료 조건**:
- Premium 사용자가 심층 리포트를 요청하고 완료 시 알림 받음
- 공유 링크로 결과를 다른 사람에게 보여줄 수 있음
- 결제 플로우가 정상 작동함

### M3 - Quality & Growth (2주)

**목표**: 성장 추적, 내보내기, 품질 개선

- [ ] Version comparison (성장 벡터 계산)
- [ ] PDF export (유료 기능)
- [ ] Image export for social sharing
- [ ] Sentry error tracking
- [ ] Audit logs for critical events
- [ ] Performance optimization
- [ ] Legal documents (terms, privacy, refund)

**완료 조건**:
- 사용자가 과거 결과와 비교하여 성장을 확인할 수 있음
- Pro 사용자가 PDF를 다운로드할 수 있음
- 에러 추적 및 모니터링이 작동함

## Architecture

### Packages Structure

```
packages/
├── engine/          # Core scoring & mapping logic
│   ├── src/
│   │   ├── version.ts
│   │   ├── types.ts
│   │   ├── scoring/  # Big5, MBTI, RETI
│   │   └── mapping/  # Tribes, Stones, Heroes
│   └── __tests__/
└── types/           # Shared TypeScript types
    └── src/
        ├── api.ts
        ├── database.ts
        └── payment.ts
```

### API Routes

```
/api/
├── assess              POST - Submit assessment answers
├── results/[id]        GET  - Fetch result snapshot
├── report              POST - Request report generation
├── report/[id]         GET  - Fetch report status/content
├── payments/
│   ├── checkout        POST - Create Stripe session
│   └── webhook         POST - Handle Stripe events
└── me/
    └── exports         POST - Generate data export
```

### App Routes

```
/                       Landing page
/dashboard              Recent results, growth chart, report status
/analyze                Start/restart assessment
/results/[id]           Result snapshot (immediate)
/report/[id]            Deep report (async generated)
/settings               Profile, plan, data export
/pricing                Plan comparison & upgrade
```

## Technical Decisions

### Data Model

- **assessments**: Raw answers + hash + engine_version
- **results**: Score snapshots (immutable, versioned)
- **reports**: Narrative + visuals (async generated)
- **payments**: Stripe subscription management
- **audit_logs**: Critical event tracking

### Engine Pipeline

1. **Scoring**: Huber clipping → Softmax → Big5/MBTI/RETI
2. **Mapping**: Birth date → Tribe, Personality → Stone, Combined → Hero
3. **Snapshot**: Store with engine_version for reproducibility
4. **Report**: Async LLM generation with status tracking

### Security

- NextAuth.js for authentication
- Supabase RLS for row-level security
- Share links with expiry and revocation
- Data export with signed URLs

## Current Status

**Sprint**: M1 (Week 1/2)  
**Last Update**: 2025-10-16  
**Next Up**: PR #2 (Engine implementation)

---

For detailed technical specs, see:
- [Architecture Decision Records](./adr/)
- [API Documentation](./api.md)
- [Engine Specification](./engine-spec.md)

