# Designary

디자이너가 작업 중 사용하는 도구를 모으는 React + TypeScript 앱입니다.
왼쪽 사이드바에서 도구를 전환합니다.

| 도구 | 설명 |
| --- | --- |
| 4의 배수 툴 | 4의 배수 빠른 복사와 가장 가까운 4의 배수 계산 |
| UI 용어 사전 | UI 용어 검색과 복사 |
| px ↔ rem 변환기 | 기준 글자 크기에 맞춘 px/rem 변환과 자주 쓰는 값 |
| 컬러 대비 검사기 | 명암비와 WCAG 2.x AA/AAA 충족 여부, 통과하는 글자색 제안 |
| 디자인 시스템 스타터 | 프라이머리 컬러 하나로 컬러 스케일, 시맨틱 컬러, 타입 스케일을 만들고 Tailwind v4 CSS·CSS 변수·JSON으로 내보내기 |

## 폴더 구조

```text
src/
  main.tsx                  React 시작점
  App.tsx                   Figma Make 호환 진입점
  index.css                 Tailwind, 폰트, 전역 스타일
  app/
    App.tsx                 앱 화면 조합
    AppSidebar.tsx          도구 사이드바 (접기·펼치기, 모바일 메뉴)
    tools.ts                도구 목록 및 화면 등록 (첫 항목이 시작 화면)
  features/
    four-multiple/          4의 배수 툴
    glossary/               UI 용어 사전 (components, data, lib, types)
    px-rem/                 px ↔ rem 변환기
    contrast-checker/       컬러 대비 검사기
    design-system-starter/  디자인 시스템 스타터 (components, lib)
  shared/
    components/             PageHeader, ToastProvider, CollapsibleCard,
                            ColorField, InfoTip, ui/ (shadcn 기반 공통 UI)
    hooks/                  useClipboard, useToast
    lib/                    clipboard, color(OKLCH·명암비), utils
config/
  figma-plugins.ts          Figma Make 전용 Vite 플러그인
.figma/make/                Figma Make 실행 설정 (site.json은 빌드 메타데이터에 사용)
.github/workflows/          main 푸시 시 GitHub Pages 배포
tests/                      node:test 기반 계산 로직 테스트
docs/research/              도구 확장 리서치 문서
```

## 새 기능 추가

1. `src/features/<기능명>/`에 기능의 화면과 필요한 코드를 둡니다.
2. 그 기능만 사용하는 컴포넌트, 데이터, 타입은 같은 폴더에 둡니다.
3. 여러 기능에서 재사용하는 코드는 `src/shared/`에 둡니다.
4. `src/app/tools.ts`에 기능 화면을 등록하고 `src/app/AppSidebar.tsx`의 아이콘 목록에 추가하면 사이드바에 표시됩니다.

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
- 이전의 `gh-pages` 브랜치는 사용하지 않습니다.
