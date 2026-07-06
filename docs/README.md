# TOKTOK 개발 규칙 문서

이 폴더는 `PRD.md`를 실제 개발 작업으로 옮길 때 계속 참고할 규칙 문서를 모아둔다.

작업을 시작하기 전에는 `AGENTS.md`의 매핑을 먼저 확인하고, 해당 작업에 연결된 문서를 읽은 뒤 구현한다.

## 문서 목록

| 문서 | 용도 |
| --- | --- |
| [product-principles.md](./product-principles.md) | 제품의 핵심 방향, MVP 우선순위, 금지해야 할 경험 |
| [interaction-rules.md](./interaction-rules.md) | 뽁뽁이 터뜨리기, 연속 입력, 사운드, 진동, 애니메이션 규칙 |
| [reward-collection-rules.md](./reward-collection-rules.md) | 랜덤 보상, 오늘 주운 것들, 도감, 콤보, 피버타임 규칙 |
| [frontend-architecture-rules.md](./frontend-architecture-rules.md) | React/Vite/TypeScript/Zustand 기반 프론트엔드 구조 규칙 |
| [data-backend-rules.md](./data-backend-rules.md) | Supabase, DB, Storage, RLS, 콘텐츠 검수 규칙 |
| [quality-rules.md](./quality-rules.md) | 성능, 접근성, 모바일, 분석 이벤트, 테스트 기준 |
| [development-plan.md](./development-plan.md) | Phase별 개발 로드맵과 완료 기준 |
| [completed-plans.md](./completed-plans.md) | 완료된 작업과 검증 기록 |

루트의 [TODO.md](../TODO.md)는 현재 작업 체크리스트다.

## 공통 원칙

1. PRD의 핵심 가치는 항상 `손맛 > 감각적 만족 > 랜덤 보상 > 수집 욕구` 순서로 판단한다.
2. 보상, 안내, 모달, 광고성 요소는 터뜨리는 흐름을 방해하지 않아야 한다.
3. 모바일 터치 드래그와 한 손 조작을 기본 사용 시나리오로 본다.
4. 사운드, 진동, 이펙트는 기본 ON이지만 각각 독립적으로 끌 수 있어야 한다.
5. MVP에서는 강제 광고, 결제, 랭킹, 친구, 실시간 커뮤니티, 앱 출시, 푸시, AI 추천을 만들지 않는다.
