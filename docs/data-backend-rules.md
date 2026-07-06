# 데이터와 백엔드 규칙

## 기술 스택

PRD 기준 백엔드는 Supabase를 사용한다.

사용 범위는 다음과 같다.

- Auth
- PostgreSQL Database
- Storage
- Row Level Security
- Edge Functions

## 데이터 모델

PRD의 기본 테이블은 다음과 같다.

- `users`
- `rewards`
- `user_rewards`
- `submissions`
- `user_settings`
- `themes`
- `effect_packs`
- `sound_packs`
- `play_sessions`

스키마를 추가하거나 변경할 때는 PRD의 수집, 보상, 검수 흐름을 먼저 확인한다.

## 공통 데이터 규칙

- ID는 `uuid`를 기본으로 한다.
- 생성 시간은 `created_at`을 둔다.
- 상태 값은 문자열 union으로 타입을 제한한다.
- 사용자 귀속 데이터는 RLS 정책을 먼저 설계한다.
- 운영자 전용 데이터는 클라이언트에서 직접 수정하지 않도록 한다.
- 이미지, GIF, 사운드, 테마 프리뷰는 Supabase Storage에 저장한다.

## 보상 데이터

`rewards`는 보상 풀의 원천 데이터다.

필수 개념은 다음과 같다.

- `content_type`: `text`, `image`, `gif`, `item`, `coupon`
- `rarity`: `common`, `rare`, `super_rare`
- `source_type`: `official`, `user`, `sponsor`
- `is_active`: 노출 가능 여부
- `season_tag`: 시즌 또는 이벤트 분류

비활성 보상은 신규 드랍 대상에서 제외한다. 이미 획득한 보상 기록은 삭제하지 않는 것을 기본으로 한다.

## 획득 데이터

`user_rewards`는 사용자가 획득한 기록이다.

`obtained_source`는 다음 값을 기본으로 한다.

- `random`
- `combo`
- `fever`
- `lucky`

게스트 사용자의 임시 획득 기록은 로컬 또는 세션 상태로 보관하고, 로그인 또는 도감 저장 시 서버 저장을 고려한다.

## 사용자 설정

`user_settings`는 감각 설정을 저장한다.

필수 설정은 다음과 같다.

- `sound_enabled`
- `vibration_enabled`
- `volume`
- `selected_theme_id`
- `selected_effect_id`
- `selected_sound_pack_id`

로그인 전에도 설정은 동작해야 하므로 로컬 저장과 서버 저장의 병합 규칙을 명확히 둔다.

## 사용자 제보

사용자 제출 콘텐츠는 바로 공개하지 않는다.

상태 값은 다음을 사용한다.

- `pending`
- `approved`
- `rejected`
- `hidden`

승인된 콘텐츠만 보상 풀에 등록한다.

검수 이유는 다음을 방지하기 위해 필수다.

- 악성 콘텐츠
- 광고성 콘텐츠
- 저작권 문제
- 서비스 감정선과 맞지 않는 콘텐츠
- 부적절하거나 불쾌한 콘텐츠

## 관리자 기능

관리자는 다음 작업을 할 수 있어야 한다.

- 승인 대기 목록 조회
- 콘텐츠 상세 보기
- 승인
- 거절
- 거절 사유 입력
- 콘텐츠 희귀도 지정
- 콘텐츠 카테고리 지정
- 공개 여부 설정
- 운영자 직접 보상 등록과 비활성화

관리자 권한 확인은 클라이언트 표시만으로 처리하지 않고 서버 정책 또는 Edge Function에서 보장한다.

## 협찬과 경품

협찬, 쿠폰, 경품은 초희귀 보상으로 다룬다.

좋은 방식은 다음과 같다.

- 희귀 상자에서 협찬 쿠폰 등장
- 시즌 이벤트 보상
- 피버타임 한정 응모권
- 초희귀 경품 티켓

금지 방식은 다음과 같다.

- 버블 터뜨릴 때 광고 팝업
- 보상 대신 광고 노출
- 콤보 실패 후 광고 강제 시청
- 화면 중앙 배너 광고
