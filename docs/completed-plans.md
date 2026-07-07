# 완료된 개발 계획 기록

완료한 작업은 `TODO.md`에서 체크한 뒤 이 문서에 기록한다.

## 기록 규칙

각 완료 기록은 다음 형식을 따른다.

```md
## YYYY-MM-DD

### 작업명

- Phase: Phase 번호와 이름
- 관련 TODO: TODO 항목명
- 변경 파일: 주요 파일 경로
- 검증: 실행한 테스트, 빌드, 수동 확인
- 비고: 남은 리스크 또는 후속 작업
```

## 2026-07-06

### 개발 규칙 문서 작성

- Phase: 준비 작업
- 관련 TODO: 없음
- 변경 파일: `AGENTS.md`, `docs/README.md`, `docs/product-principles.md`, `docs/interaction-rules.md`, `docs/reward-collection-rules.md`, `docs/frontend-architecture-rules.md`, `docs/data-backend-rules.md`, `docs/quality-rules.md`
- 검증: 문서 파일 목록 확인, `AGENTS.md`와 `docs/README.md` UTF-8 내용 확인
- 비고: 개발 진행 시 작업 유형별 매핑에 따라 관련 규칙 문서를 먼저 참고한다.

### 개발 계획과 작업 관리 문서 작성

- Phase: 준비 작업
- 관련 TODO: 없음
- 변경 파일: `docs/development-plan.md`, `TODO.md`, `docs/completed-plans.md`, `docs/README.md`
- 검증: 문서 간 참조 경로와 Phase 구성을 확인한다.
- 비고: 이후 완료 작업은 `TODO.md` 체크와 함께 이 문서에 누적 기록한다.

## 2026-07-07

### Phase 0 프로젝트 기반 구축

- Phase: Phase 0. 프로젝트 기반 구축
- 관련 TODO: Vite + React + TypeScript 프로젝트 초기화, Tailwind CSS 설정, Zustand/Framer Motion/Howler.js 설치, 기본 폴더 구조 구성, 도메인 타입과 상수 초안 작성, 기본 화면 전환 구조 결정, lint/build 스크립트 확인, 로컬 개발 서버 실행 확인
- 변경 파일: `.gitignore`, `package.json`, `package-lock.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tailwind.config.ts`, `postcss.config.js`, `eslint.config.js`, `src/main.tsx`, `src/app/App.tsx`, `src/styles/index.css`, `src/domains/**`, `src/shared/**`, `TODO.md`
- 검증: `npm.cmd install`, `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run dev -- --host 127.0.0.1`
- 비고: 샌드박스의 상위 디렉터리 읽기 제한 때문에 Vite build/dev는 승인 환경에서 검증했다. dev server는 `http://127.0.0.1:5173/`로 기동 확인 후 종료했다.

### Phase 1 반응형 버블 보드와 터뜨리기 입력

- Phase: Phase 1. 핵심 손맛 구현
- 관련 TODO: 반응형 버블 배치 알고리즘 구현, 버블 상태 모델 구현, 클릭/터치 터뜨리기 구현, 마우스 드래그 연속 터뜨리기 구현, 모바일 터치 드래그 연속 터뜨리기 구현, 이미 터진 버블 중복 처리 방지, 기본 눌림/터짐 애니메이션 구현, 터진 버블 자동 재생성 구현
- 변경 파일: `src/app/App.tsx`, `src/features/play/BubbleBoard.tsx`, `src/features/play/PlayScreen.tsx`, `src/domains/bubble/**`, `src/shared/hooks/useElementSize.ts`, `TODO.md`
- 검증: `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run dev -- --host 127.0.0.1`
- 비고: 파티클 구현과 데스크톱/모바일 실제 화면 크기별 수동 검증은 남은 Phase 1 작업으로 유지한다. dev server는 `http://127.0.0.1:5173/`로 기동 확인 후 종료했다.

### 버블 자동 재생성 방식 수정

- Phase: Phase 1. 핵심 손맛 구현
- 관련 TODO: 터진 버블 자동 재생성 구현
- 변경 파일: `src/domains/bubble/bubble.constants.ts`, `src/domains/bubble/bubble.store.ts`, `TODO.md`, `docs/development-plan.md`, `docs/completed-plans.md`
- 검증: `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run dev -- --host 127.0.0.1`
- 비고: 사용자가 계속 터뜨릴 수 있도록 전체 판 리필 방식에서 개별 버블 재생성 방식으로 변경했다. 기존 5173 포트가 사용 중이라 확인용 dev server는 `http://127.0.0.1:5174/`로 기동 확인 후 종료했다.

### 버블 가시성, 보상 확률, 중복 보상 조정

- Phase: Phase 1/3 조정
- 관련 TODO: 핵심 손맛 구현, 보상 루프 구현
- 변경 파일: `src/features/play/BubbleBoard.tsx`, `src/domains/reward/reward.constants.ts`, `src/domains/reward/reward.engine.ts`, `src/domains/reward/reward.store.ts`
- 검증: `npm.cmd run lint`, `npm.cmd run build`
- 비고: 버블 색상과 그림자를 진하게 조정해 배경과의 대비를 높였다. 보상 드랍 확률은 기존보다 낮췄고, 이미 수집한 보상 ID는 이후 랜덤 후보에서 제외해 수집 목록에 중복으로 쌓이지 않게 했다.

### Phase 1 기본 파티클 구현

- Phase: Phase 1. 핵심 손맛 구현
- 관련 TODO: 기본 파티클 구현
- 변경 파일: `src/features/play/BubbleBoard.tsx`, `TODO.md`
- 검증: `npm.cmd run lint`, `npm.cmd run build`
- 비고: 파티클은 Framer Motion 기반의 짧은 버스트로 구현했다. 사운드/진동 연동은 Phase 2에서 진행한다.

### Phase 2 감각 피드백과 설정

- Phase: Phase 2. 감각 피드백과 설정
- 관련 TODO: Howler.js 기반 사운드 래퍼 구현, 기본 터짐 사운드 랜덤 재생 구현, 연속 입력 중 사운드 중복 제한 구현, Vibration API 래퍼 구현, 진동 미지원 환경 무해 처리, 일반/희귀/초희귀/피버 진동 패턴 준비, 설정 상태 구현, 사운드 ON/OFF 구현, 볼륨 조절 구현, 진동 ON/OFF 구현, 이펙트 강도 설정 구현, 설정 로컬 저장 구현
- 변경 파일: `src/shared/audio/**`, `src/shared/haptics/**`, `src/domains/settings/**`, `src/features/settings/SettingsPanel.tsx`, `src/features/play/BubbleBoard.tsx`, `src/features/play/PlayScreen.tsx`, `TODO.md`
- 검증: `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run dev -- --host 127.0.0.1`
- 비고: 기본 pop 사운드는 런타임 생성 WAV data URI를 Howler로 재생한다. 사운드는 34ms 최소 간격으로 제한했고, 설정은 `toktok-settings` localStorage 키로 저장한다. dev server는 `http://127.0.0.1:5173/`로 기동 확인 후 종료했다.

### Phase 3 보상 루프 구현

- Phase: Phase 3. 보상 루프 구현
- 관련 TODO: 보상 타입과 희귀도 타입 구현, 샘플 보상 데이터 작성, 랜덤 보상 확률 엔진 구현, 콤보/피버 확률 modifier 구조 준비, 터진 위치 기준 보상 드랍 연출 구현, 화면 하단 쌓임 연출 구현, `오늘 주운 것들 N개` 하단 고정 버튼 구현, 오늘 주운 것들 오버레이 구현, 희귀도별 필터 구현, 새로 얻은 보상 강조 구현, 보상 상세 보기 구현
- 변경 파일: `src/domains/reward/**`, `src/features/reward/**`, `src/features/play/BubbleBoard.tsx`, `src/features/play/PlayScreen.tsx`, `TODO.md`
- 검증: `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run dev -- --host 127.0.0.1`
- 비고: 보상은 즉시 팝업으로 띄우지 않고 터진 위치에서 하단으로 떨어지는 연출을 사용한다. `도감에 저장` 버튼은 상세 보기 안에 배치했으며 실제 장기 저장은 Phase 4에서 연결한다. dev server는 `http://127.0.0.1:5173/`로 기동 확인 후 종료했다.
