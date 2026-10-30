# Designary

디자이너가 작업 중 사용하는 도구를 모으는 React + TypeScript 앱입니다.
UI 용어 검색·복사와 4의 배수 빠른 복사·계산 기능을 제공합니다.

## 폴더 구조

```text
src/
  main.tsx                  React 시작점
  App.tsx                   Figma Make 호환 진입점
  index.css                 Tailwind, 폰트, 전역 스타일
  app/
    App.tsx                 앱 화면 조합
    tools.ts                도구 목록 및 화면 등록
  features/
    four-multiple/
      FourMultipleSnapTool.tsx  빠른 복사, 계산, 초기화 화면
      lib/snapToFour.ts      4의 배수 계산 및 범위 정의
    glossary/
      GlossaryPage.tsx       용어 사전 화면과 검색 상태
      components/           용어 사전 전용 UI
      data/categories.ts    카테고리와 용어 데이터
      types.ts              용어 사전 타입
  shared/
    components/ToastProvider.tsx  복사 성공·실패 알림 (추가 패키지 없음)
    hooks/useToast.ts       공용 알림 호출
    hooks/useClipboard.ts   복사 상태, 오류, 타이머 관리
    lib/clipboard.ts        브라우저 클립보드 처리
  assets/references/         기존 참고 이미지 (현재 화면에서 미사용)
config/
  figma-plugins.ts           Figma Make 전용 Vite 플러그인
.figma/make/                 Figma Make 실행·배포 설정
```

## 새 기능 추가

1. `src/features/<기능명>/`에 기능의 화면과 필요한 코드를 둡니다.
2. 그 기능만 사용하는 컴포넌트, 데이터, 타입은 같은 폴더에 둡니다.
3. 여러 기능에서 재사용하는 코드는 `src/shared/`에 둡니다.
4. `src/app/tools.ts`에 기능 화면을 등록하면 상단 전환 메뉴에 표시됩니다.

기능끼리 직접 참조하지 않고 앱에서 조합합니다. 작은 기능은 화면 파일부터
시작하고, 필요할 때 하위 폴더를 추가합니다. `@/`는 `src/`를 가리킵니다.
4의 배수 도구는 제공된 코드의 범위를 유지합니다. 빠른 복사는 4–696,
계산은 가장 가까운 4의 배수로 반올림한 뒤 0–700으로 제한합니다.
Enter로 계산하고, 결과 버튼 클릭 또는 키보드로 숫자를 복사할 수 있습니다.
입력을 수정하면 이전 결과를 지우며, 초기화는 입력과 결과를 모두 지웁니다.

## 실행 및 검증

Node.js 22, pnpm 10.34.3을 사용합니다 (`.mise.toml` 참고).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm format
```

Figma Make 안에서는 실행 중인 개발 서버를 사용합니다.
`vite.config.ts`와 `config/figma-plugins.ts`는 Figma 미리보기 및 배포 연동을
유지합니다. 사이트 메타데이터는 `.figma/make/site.json`에서 설정합니다.

## 배포

`main`에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 타입체크, 테스트,
빌드를 거쳐 GitHub Pages(`https://y0oonji.github.io/Designary/`)에 올립니다.
수동 배포는 Actions 탭에서 Deploy 워크플로의 Run workflow로 실행합니다.

- 저장소 Settings → Pages → Source는 `GitHub Actions`로 설정해야 합니다.
- 사이트가 `/Designary/` 아래에서 열리므로, 워크플로가 빌드할 때
  `FIGMA_PUBLIC_URL=/Designary`를 넣어 파일 경로의 기준을 맞춥니다.
- 이전의 `gh-pages` 브랜치와 `.figma/make/deploy`는 사용하지 않습니다.
