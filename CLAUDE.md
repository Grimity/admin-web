# CLAUDE.md

이 문서는 Claude Code (claude.ai/code) 가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

**Grimity Admin Web** — 그리미티(Grimity) 서비스의 운영자용 어드민 페이지. 별도의 React SPA 로, [`../server`](../server) 의 `/admin/*` 엔드포인트만 호출한다.

- 자매 프로젝트
  - [`../server`](../server) — NestJS 백엔드 (모든 어드민 API 정의)
  - [`../FE-Grimity`](../FE-Grimity) — 일반 사용자용 Next.js 프론트
- 어드민 라우트는 모두 `@ApiExcludeController` 로 Swagger 에서 빠져 있으므로, 단일 진실 공급원은 [`../server/docs/admin-api.md`](../server/docs/admin-api.md). API 작업 전 반드시 이 문서를 먼저 확인한다.

## 개발 명령어

```bash
npm run dev      # Vite 개발 서버
npm run build    # tsc -b && vite build (타입체크 포함 프로덕션 빌드)
npm run lint     # ESLint
npm run preview  # 프로덕션 빌드 미리보기
```

## 기술 스택

- **빌드**: Vite 8
- **언어**: TypeScript 6 (strict)
- **UI**: React 19
- **스타일**: SCSS Modules (`*.module.scss`) — `sass` devDependency 사용
- **향후 도입 예정** (필요해지는 시점에 추가):
  - 인증 토큰 저장: Zustand
  - 서버 상태: TanStack Query
  - HTTP: Axios (interceptor 로 Bearer 토큰 자동 부착, 401 처리)
  - 라우팅: React Router (또는 TanStack Router)

## 디렉터리 구조 (FE-Grimity 미러)

```
src/
├── api/          리소스별 API 함수 (feeds/, posts/, postComments/, ...)
├── components/   컴포넌트 폴더 (Component.tsx + .module.scss + .types.ts)
├── pages/        라우트 페이지 컴포넌트
├── hooks/        커스텀 훅
├── states/       Zustand 스토어 (authStore 등)
├── styles/       전역/공통 SCSS
├── types/        공통 타입 정의
└── utils/        유틸 함수
```

## 컨벤션

- **Path alias**: `@/*` → `src/*`
  ```ts
  import { getFeeds } from '@/api/feeds/getFeeds';
  ```
- **컴포넌트**: 폴더 단위로 묶는다.
  ```
  components/FeedRow/
    ├─ FeedRow.tsx
    ├─ FeedRow.module.scss
    └─ FeedRow.types.ts
  ```
- **API 함수 네이밍** (FE-Grimity 와 동일):
  - `get{Resource}.ts` — GET (React Query 훅도 같은 파일에)
  - `post{Resource}.ts` — POST
  - `delete{Resource}.ts` — DELETE
- **타입**: 백엔드 DTO 가 필요할 경우 `../server/src/...` 의 정의를 참조하거나, 명세 기반으로 `src/types/admin/` 에 직접 선언한다 (`@grimity/dto` 같은 공유 패키지는 어드민 쪽에는 없음).

## 어드민 API 사용 시 주의

상세는 [`../server/docs/admin-api.md`](../server/docs/admin-api.md) 참고. 항상 기억할 것:

1. **인증**: `POST /admin/login` 응답의 `accessToken` (JWT) 을 모든 요청에 `Authorization: Bearer <token>` 헤더로 전송. 401 이면 토큰 만료 → 로그인 페이지로 이동.
2. **Cursor 페이지네이션**: 응답의 `nextCursor` 를 다음 요청 query 에 그대로 전달. 클라에서 파싱하지 않는다. `null` 이면 마지막 페이지.
3. **이미지 URL**: `image`, `thumbnail` 응답은 이미 FULL URL 이다. `IMAGE_URL` prefix 를 또 붙이지 않는다. `null` 은 이미지 없음.
4. **공식계정 명의 작성** (`POST /admin/feed-comments`, `POST /admin/post-comments`, `POST /admin/notices`): `writerId` 는 서버 환경변수 `OFFICIAL_USER_ID` 로 강제 고정. 미설정 시 500.
5. **삭제 API**: 작성자 검증 없음. 어드민 권한 자체가 곧 권한.

## 환경 변수

Vite 는 클라이언트 노출 변수에 `VITE_` 접두사를 요구한다. `.env.local` 에 정의:

- `VITE_API_BASE_URL` — 어드민 API base URL (예: `https://api.grimity.com`)

현재 `.env.local` 은 미생성 상태. 첫 API 호출 작업 시 사용자에게 실제 값을 확인한 뒤 생성한다.
