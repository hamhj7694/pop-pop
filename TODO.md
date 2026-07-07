# TOKTOK TODO

이 문서는 현재 작업을 관리하는 체크리스트다. 완료한 항목은 체크한 뒤 `docs/completed-plans.md`에 완료 기록을 남긴다.

참고 문서:

- [PRD.md](./PRD.md)
- [AGENTS.md](./AGENTS.md)
- [docs/development-plan.md](./docs/development-plan.md)
- [docs/product-principles.md](./docs/product-principles.md)
- [docs/interaction-rules.md](./docs/interaction-rules.md)
- [docs/reward-collection-rules.md](./docs/reward-collection-rules.md)
- [docs/frontend-architecture-rules.md](./docs/frontend-architecture-rules.md)
- [docs/data-backend-rules.md](./docs/data-backend-rules.md)
- [docs/quality-rules.md](./docs/quality-rules.md)

## 사용 규칙

- 새 작업은 가장 관련 있는 Phase 아래에 추가한다.
- 작업을 완료하면 `[ ]`를 `[x]`로 바꾼다.
- 완료한 작업은 같은 날 `docs/completed-plans.md`에 완료일, 관련 Phase, 검증 내용을 기록한다.
- 계획이 바뀌면 `docs/development-plan.md`도 함께 수정한다.

## Phase 0. 프로젝트 기반 구축

- [x] Vite + React + TypeScript 프로젝트 초기화
- [x] Tailwind CSS 설정
- [x] Zustand, Framer Motion, Howler.js 설치
- [x] 기본 폴더 구조 구성
- [x] 도메인 타입과 상수 초안 작성
- [x] 기본 화면 전환 구조 결정
- [x] lint, format, build 스크립트 확인
- [x] 로컬 개발 서버 실행 확인

## Phase 1. 핵심 손맛 구현

- [x] 반응형 버블 배치 알고리즘 구현
- [x] 버블 상태 모델 구현
- [x] 클릭/터치 터뜨리기 구현
- [x] 마우스 드래그 연속 터뜨리기 구현
- [x] 모바일 터치 드래그 연속 터뜨리기 구현
- [x] 이미 터진 버블 중복 처리 방지
- [x] 기본 눌림/터짐 애니메이션 구현
- [x] 기본 파티클 구현
- [x] 터진 버블 자동 재생성 구현
- [ ] 데스크톱/모바일 화면 크기 변경 시 배치 확인

## Phase 2. 감각 피드백과 설정

- [x] Howler.js 기반 사운드 래퍼 구현
- [x] 기본 터짐 사운드 랜덤 재생 구현
- [x] 연속 입력 중 사운드 중복 제한 구현
- [x] Vibration API 래퍼 구현
- [x] 진동 미지원 환경 무해 처리
- [x] 일반/희귀/초희귀/피버 진동 패턴 준비
- [x] 설정 상태 구현
- [x] 사운드 ON/OFF 구현
- [x] 볼륨 조절 구현
- [x] 진동 ON/OFF 구현
- [x] 이펙트 강도 설정 구현
- [x] 설정 로컬 저장 구현

## Phase 3. 보상 루프 구현

- [x] 보상 타입과 희귀도 타입 구현
- [x] 샘플 보상 데이터 작성
- [x] 랜덤 보상 확률 엔진 구현
- [x] 콤보/피버 확률 modifier 구조 준비
- [x] 터진 위치 기준 보상 드랍 연출 구현
- [x] 화면 하단 쌓임 연출 구현
- [x] `오늘 주운 것들 N개` 하단 고정 버튼 구현
- [x] 오늘 주운 것들 오버레이 구현
- [x] 희귀도별 필터 구현
- [x] 새로 얻은 보상 강조 구현
- [x] 보상 상세 보기 구현

## Phase 4. 도감과 장기 수집

- [ ] 도감 데이터 모델 구현
- [ ] 획득 보상 도감 저장 구현
- [ ] 미획득 콘텐츠 `???` 표시 구현
- [ ] 전체 수집률 구현
- [ ] 카테고리별 수집률 구현
- [ ] 일반/희귀/초희귀/피버 전용 탭 구현
- [ ] 최근 획득 항목 표시 구현
- [ ] 게스트 도감 저장 유도 정책 정리
- [ ] 로컬 저장 기반 MVP 도감 구현

## Phase 5. 콤보와 피버타임

- [x] 콤보 카운트 구현
- [x] 콤보 종료 타이머 구현
- [ ] 콤보 단계 감지 구현
- [ ] 콤보 보상 modifier 구현
- [ ] 콤보 종료 결과 표시 구현
- [ ] 피버타임 발동 확률 구현
- [ ] 피버타임 남은 시간 표시 구현
- [ ] 피버타임 상태 관리 구현
- [ ] 피버타임 배경/버블/파티클 연출 구현
- [ ] 피버타임 사운드/진동 연출 구현
- [ ] 피버 전용 보상 카테고리 구현

## Phase 6. Supabase 연동과 데이터 영속화

- [ ] Supabase 환경 변수 구조 정리
- [ ] DB schema 초안 작성
- [ ] `rewards` 테이블 구현
- [ ] `user_rewards` 테이블 구현
- [ ] `user_settings` 테이블 구현
- [ ] `play_sessions` 테이블 구현
- [ ] Auth 연동
- [ ] 게스트 데이터와 로그인 데이터 병합 정책 구현
- [ ] Storage 버킷 설계
- [ ] RLS 정책 작성
- [ ] 기본 seed 데이터 작성

## Phase 7. 사용자 제보와 관리자 운영

- [ ] 콘텐츠 제보 화면 구현
- [ ] 텍스트 제보 구현
- [ ] 이미지/GIF 업로드 구현
- [ ] 제출 동의와 검수 안내 구현
- [ ] `submissions` 상태 흐름 구현
- [ ] 관리자 승인 대기 목록 구현
- [ ] 관리자 콘텐츠 상세 보기 구현
- [ ] 승인 처리 구현
- [ ] 거절과 거절 사유 구현
- [ ] 승인 콘텐츠의 보상 풀 등록 구현
- [ ] 운영자 직접 보상 등록 구현
- [ ] 보상 비활성화 구현

## Phase 8. 품질 안정화와 MVP 릴리스 준비

- [ ] 모바일 터치 드래그 집중 테스트
- [ ] 60FPS에 가까운 인터랙션 유지 확인
- [ ] 파티클 생성량 최적화
- [ ] 사운드 중복 재생 최적화
- [ ] 설정/도감/오늘 주운 것들 접근성 점검
- [ ] PostHog 이벤트 연결
- [ ] `bubble_popped` 고빈도 이벤트 샘플링 또는 집계 정책 적용
- [ ] 주요 플로우 테스트 정리
- [ ] production build 확인
- [ ] Vercel 배포 준비

## Backlog

- [ ] 프리미엄 테마 확장
- [ ] 프리미엄 효과팩 확장
- [ ] 프리미엄 사운드팩 확장
- [ ] 협찬/경품 보상 운영 고도화
- [ ] 시즌별 도감 분리
- [ ] 오늘의 행운 발견
