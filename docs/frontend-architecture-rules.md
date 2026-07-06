# 프론트엔드 아키텍처 규칙

## 기술 스택

PRD 기준 프론트엔드 스택은 다음과 같다.

- React
- Vite
- TypeScript
- Zustand
- Framer Motion
- Howler.js
- Tailwind CSS

다른 라이브러리를 추가할 때는 기존 스택으로 해결하기 어려운지 먼저 확인한다.

## 코드 구조 원칙

- 터뜨리기 입력, 버블 상태, 콤보, 피버타임, 보상 드랍은 서로 결합도를 낮춘다.
- 렌더링에 필요한 상태와 영속화할 상태를 분리한다.
- 확률, 희귀도, 콤보 단계, 피버타임 지속 시간 같은 게임 규칙 값은 상수 또는 설정 객체로 모은다.
- 사운드, 진동, 파티클 같은 감각 효과는 설정값을 통해 독립적으로 제어한다.
- UI 컴포넌트는 플레이 흐름을 막는 모달보다 오버레이, 하단 시트, 고정 버튼을 우선한다.

## 권장 도메인 분리

아직 실제 소스 구조가 정해지지 않았다면 아래 역할 분리를 기본값으로 삼는다.

- `bubble`: 버블 배치, 상태, 입력 판정
- `combo`: 콤보 카운트, 종료 타이머, 콤보 보상
- `fever`: 피버 발동, 남은 시간, 피버 modifier
- `reward`: 보상 확률, 보상 드랍, 오늘 주운 것들, 도감 저장
- `settings`: 사운드, 진동, 효과 강도, 테마, 효과팩, 사운드팩
- `audio`: Howler.js 기반 사운드 로딩과 재생 제어
- `haptics`: Vibration API 래퍼
- `analytics`: PostHog 이벤트 수집

## 상태 관리

Zustand를 사용할 때는 다음 기준을 따른다.

- 입력 빈도가 높은 버블 상태는 불필요한 전체 리렌더를 만들지 않도록 selector를 사용한다.
- 한 프레임 안에서 대량 업데이트가 필요한 경우 batch 또는 로컬 ref 기반 처리를 검토한다.
- 사용자 설정은 local storage 또는 서버 설정과 동기화 가능하도록 분리한다.
- 세션성 데이터와 계정 귀속 데이터는 명확히 구분한다.

## 타입 규칙

PRD의 데이터 타입을 기준으로 도메인 타입을 먼저 정의한다.

기본 union 예시는 다음과 같다.

```ts
type RewardRarity = 'common' | 'rare' | 'super_rare';
type RewardSourceType = 'official' | 'user' | 'sponsor';
type RewardContentType = 'text' | 'image' | 'gif' | 'item' | 'coupon';
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'hidden';
type ObtainedSource = 'random' | 'combo' | 'fever' | 'lucky';
```

문자열 리터럴을 반복해서 쓰지 말고 도메인 타입 또는 상수를 사용한다.

## UI 구현 기준

- 첫 화면은 플레이 화면이어야 한다.
- 메인 화면에는 버블 영역, 콤보 표시, 피버타임 표시, 오늘 주운 것들 버튼, 설정 버튼, 도감 버튼이 있어야 한다.
- 터치 타깃은 모바일에서 오작동하지 않을 만큼 충분히 커야 한다.
- 설정, 도감, 오늘 주운 것들은 플레이를 완전히 끊는 화면보다 빠르게 닫을 수 있는 오버레이를 우선한다.
- 희귀도는 색상만으로 구분하지 않고 라벨, 아이콘, 패턴, 텍스트를 함께 사용한다.

## 사운드와 햅틱 구현 기준

- 사운드 재생은 Howler.js 래퍼를 통해 호출한다.
- 연속 입력 시 같은 사운드가 무제한 중첩되지 않도록 제한한다.
- 진동은 `navigator.vibrate` 존재 여부를 확인한 뒤 호출한다.
- 미지원 환경에서 예외가 사용자에게 노출되면 안 된다.

## 분석 이벤트

PostHog 이벤트 이름은 PRD의 명칭을 우선 사용한다.

- `bubble_popped`
- `combo_reached`
- `combo_ended`
- `reward_dropped`
- `reward_collected`
- `fever_started`
- `fever_ended`
- `theme_selected`
- `sound_toggled`
- `vibration_toggled`
- `collection_opened`
- `submission_created`

이벤트 payload에는 개인식별정보를 직접 넣지 않는다.
