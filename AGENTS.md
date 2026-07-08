# TOKTOK 개발 에이전트 규칙

이 저장소에서 작업할 때는 먼저 `PRD.md`와 아래 규칙 문서 매핑을 확인한다.

## 기본 참조 순서

1. [PRD.md](./PRD.md): 제품 요구사항의 원천 문서
2. [docs/README.md](./docs/README.md): 규칙 문서 목록
3. 작업 유형에 맞는 세부 규칙 문서

## 작업 유형별 문서 매핑

| 작업 유형 | 먼저 참고할 문서 |
| --- | --- |
| 제품 방향, 우선순위, MVP 범위 판단 | [docs/product-principles.md](./docs/product-principles.md) |
| 메인 플레이 화면, 버블 배치, 클릭/터치/드래그 입력 | [docs/interaction-rules.md](./docs/interaction-rules.md) |
| 사운드, 진동, 파티클, 애니메이션 | [docs/interaction-rules.md](./docs/interaction-rules.md), [docs/quality-rules.md](./docs/quality-rules.md) |
| 콤보 알림, 보상 발견, 문구 토스트, 비간섭 알림 스택 | [docs/interaction-rules.md](./docs/interaction-rules.md), [docs/reward-collection-rules.md](./docs/reward-collection-rules.md), [docs/quality-rules.md](./docs/quality-rules.md) |
| 랜덤 보상, 보상 낙하, 오늘 주운 것들, 도감 | [docs/reward-collection-rules.md](./docs/reward-collection-rules.md) |
| 콤보, 콤보 종료, 피버타임, 피버 전용 보상 | [docs/reward-collection-rules.md](./docs/reward-collection-rules.md), [docs/interaction-rules.md](./docs/interaction-rules.md) |
| 뽁뽁이 테마, 보상 콘텐츠 확장, 상자 개봉 이벤트 | [docs/development-plan.md](./docs/development-plan.md), [docs/interaction-rules.md](./docs/interaction-rules.md), [docs/reward-collection-rules.md](./docs/reward-collection-rules.md), [TODO.md](./TODO.md) |
| React/Vite/TypeScript/Zustand 구조 | [docs/frontend-architecture-rules.md](./docs/frontend-architecture-rules.md) |
| Howler.js, Vibration API, PostHog 이벤트 | [docs/frontend-architecture-rules.md](./docs/frontend-architecture-rules.md), [docs/quality-rules.md](./docs/quality-rules.md) |
| Supabase, DB 스키마, Storage, RLS | [docs/data-backend-rules.md](./docs/data-backend-rules.md) |
| 사용자 제보, 관리자 검수, 콘텐츠 운영 | [docs/data-backend-rules.md](./docs/data-backend-rules.md), [docs/product-principles.md](./docs/product-principles.md) |
| 성능, 접근성, 모바일 최적화, 테스트 | [docs/quality-rules.md](./docs/quality-rules.md) |
| 광고, 협찬, 경품, 수익화 판단 | [docs/product-principles.md](./docs/product-principles.md), [docs/data-backend-rules.md](./docs/data-backend-rules.md) |
| 개발 순서, Phase 판단, 작업 쪼개기 | [docs/development-plan.md](./docs/development-plan.md), [TODO.md](./TODO.md) |
| 완료 작업 기록, 검증 이력 확인 | [docs/completed-plans.md](./docs/completed-plans.md), [TODO.md](./TODO.md) |

## 반드시 지킬 핵심 규칙

- 제품 판단은 `손맛 > 감각적 만족 > 랜덤 보상 > 수집 욕구` 순서를 따른다.
- 사용자는 접속 직후 바로 뽁뽁이를 터뜨릴 수 있어야 한다.
- 보상은 즉시 팝업으로 띄우지 않는다.
- 터뜨리는 흐름을 막는 모달, 광고, 강제 안내를 만들지 않는다.
- 모바일 터치 드래그와 한 손 조작을 기본 시나리오로 본다.
- 사운드, 진동, 이펙트는 각각 독립적으로 조절 가능해야 한다.
- 콤보는 실패 페널티가 아니라 축하와 기록 요소로 표현한다.
- 사용자 제보 콘텐츠는 관리자 승인 전까지 공개하지 않는다.
- MVP에서는 강제 광고, 결제, 랭킹, 친구, 실시간 커뮤니티, 푸시, AI 추천을 구현하지 않는다.
- 작업을 시작할 때는 [TODO.md](./TODO.md)에서 현재 Phase와 미완료 항목을 확인한다.
- 작업을 완료하면 [TODO.md](./TODO.md)를 체크하고 [docs/completed-plans.md](./docs/completed-plans.md)에 완료 기록을 남긴다.
