# withddoing

푸꾸옥 가족여행 일정, 체크리스트, 경로 지도, 환율 계산을 한 화면에서 볼 수 있게 만든 `Next.js` 기반 PWA입니다.

## 주요 기능

- 일자별 여행 일정 확인
- 전체 일정 한 번에 보기
- 방문지 후기/지도/이미지/PDF 모달 보기
- GeoJSON 기반 일차별 이동 경로 지도
- 체크리스트 로컬 저장
- KRW / VND / USD 환율 계산
- PWA 설치 지원

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- react-leaflet / leaflet
- next-pwa

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 을 열면 됩니다.

## 스크립트

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 프로젝트 구조

```text
app/                페이지
components/         공용 UI 컴포넌트
data/               여행 일정, 체크리스트, 운영 룰, 지도 JSON
lib/                환율/지도 유틸
public/             PWA 자산, 이미지, 서비스워커
types/              공용 타입 정의
```

## 데이터 관리

- 일정 데이터는 `data/itinerary.json` 에서 관리합니다.
- 체크리스트는 `data/checklist.json` 에서 관리합니다.
- 운영 룰은 `data/rules.json` 에서 관리합니다.
- 지도 경로는 `data/routes/day*.json` 에서 관리합니다.

JSON만 수정해도 화면 내용이 바로 바뀌도록 구성되어 있습니다.

## 구현 메모

- 일정 카드 렌더링은 공용 컴포넌트로 분리되어 메인 화면과 전체 일정 화면이 같은 UI를 공유합니다.
- 환율 계산 로직은 `lib/exchange.ts` 에 모아두고 UI 컴포넌트에서 재사용합니다.
- 체크리스트와 환율 캐시는 `localStorage` 를 사용합니다.

## 배포 메모

- `next-pwa` 를 사용해 `manifest.json` 과 서비스워커 기반 설치형 웹앱으로 동작합니다.
- 개발 모드에서는 PWA가 비활성화되고, 프로덕션 빌드에서 활성화됩니다.
