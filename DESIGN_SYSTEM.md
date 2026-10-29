# Designary UI

shadcn/ui의 New York 구성과 Radix UI를 바탕으로 만든 공통 UI입니다.
두 화면은 `src/shared/components/ui`의 컴포넌트와 `src/index.css`의 의미 기반 토큰을 공유합니다.

## 기본 규칙

- 색상: `background`, `card`, `foreground`, `muted-foreground`, `primary`, `accent`, `border`, `destructive`, `success` 사용. 기능 화면에서 임의 색상이나 인라인 스타일을 추가하지 않습니다.
- 포인트: 선명한 파랑 `primary`(#2272EB)는 주요 동작과 선택 상태, 연한 파랑 `accent`(#EDF4FF)는 보조 강조에 사용합니다. 배경과 테두리는 푸른 기가 살짝 도는 중립 회색으로 맞춥니다.
- 서체: 한글·영문·숫자 모두 Pretendard Variable로 통일합니다. 공식 v1.3.9 가변 다이나믹 서브셋을 CDN에서 불러옵니다. 숫자 정렬은 별도 고정폭 폰트 대신 `tabular-nums`를 사용합니다. 제목 24/30px, 섹션 제목 14/16px, 본문 14px, 보조 설명 12px.
- 간격: 4px 단위. 카드 내부 20/24px, 섹션 간격 24/32px, 컨트롤 사이 8/12px.
- 모서리: 입력·버튼 `rounded-md`(4px), 탭 `rounded-lg`(6px), 카드 `rounded-xl`(8px). 기본 반경 토큰은 6px입니다.
- 그림자: 일반 카드·버튼·입력창·탭·사이드바 선택 상태에는 사용하지 않습니다. 구분은 배경과 테두리로 처리하고, 화면 위에 뜨는 토스트와 모바일 메뉴에만 그림자를 사용합니다. 키보드 포커스 링은 유지합니다.
- 높이: 버튼·입력 40px, 작은 필터 32px, 주요 숫자 입력 48px.
- 레이아웃: 데스크톱은 왼쪽 고정 사이드바(펼침 240px, 접힘 64px)와 본문으로 구성합니다. 모바일에서는 메뉴 버튼으로 사이드바를 열고, 선택·닫기·Escape로 닫습니다. 본문 최대 너비 `max-w-6xl`, 좌우 패딩 20/32px. 각 화면은 제목과 짧은 사용 설명으로 구성된 `PageHeader`를 사용합니다.

장식성 영문 라벨, 슬로건, 제목 배지, 중복 사용 안내는 추가하지 않습니다. 개수는 검색 결과처럼 판단에 필요한 곳에만 표시합니다.

## 공통 컴포넌트

| 컴포넌트 | 용도 |
| --- | --- |
| Button | 기본, outline, secondary, ghost 등의 변형. CVA로 크기·상태 통합 |
| Input / Label | 검색·숫자 입력, 포커스 링과 오류 상태 |
| Card / Badge / Separator | 콘텐츠 구획, 개수·상태, 구분선 |
| Tabs / TabsList / TabsTrigger / TabsContent | Radix 키보드 탐색 및 접근성 연결을 갖춘 모드 전환 |
| Toaster | Sonner 알림. 복사 성공·실패는 공통 `useClipboard`에서 처리 |
| PageHeader | 페이지 제목과 한 줄 사용 설명의 공통 구조 |

`components.json`은 shadcn CLI가 공유 경로에 컴포넌트를 추가하도록 설정되어 있습니다.
저장소 규칙에 따라 컴포넌트는 default export를 사용하고, 탭 하위 컴포넌트는 파일로 분리했습니다.
CLI로 추가하거나 갱신할 때도 이 규칙과 현재 토큰을 유지하세요.

## 상호작용과 접근성

- 모든 조작 요소는 키보드 포커스 링을 유지합니다. 아이콘만 있는 버튼에는 한국어 이름을 제공합니다.
- 복사 완료는 체크 아이콘과 알림으로 표시하고, 실패 시 성공으로 처리하지 않습니다.
- 계산 입력은 오류 설명과 `aria-invalid`를 연결합니다. 결과는 live region으로 알립니다.
- 검색과 카테고리는 함께 적용됩니다. 결과 수, 빈 상태, 필터 초기화를 제공합니다.
- 모바일에서 숫자는 4열, 용어는 1열부터 시작합니다. 시스템의 모션 감소 설정을 존중하고 스크롤바를 숨기지 않습니다.

기준 문서: https://ui.shadcn.com/docs/installation/manual
