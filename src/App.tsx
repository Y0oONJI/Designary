import { useState } from "react";

type Term = {
  en: string;
  ko: string;
  example?: string;
};

type Category = {
  id: string;
  label: string;
  terms: Term[];
};

const categories: Category[] = [
  {
    id: "component",
    label: "컴포넌트 기본 상태",
    terms: [
      { en: "default", ko: "기본" },
      { en: "hover", ko: "마우스 올렸을 때" },
      { en: "focused", ko: "포커스됨" },
      { en: "active", ko: "클릭 중" },
      { en: "pressed", ko: "눌림" },
      { en: "disabled", ko: "비활성 (클릭 불가)" },
      { en: "enabled", ko: "활성 (클릭 가능)" },
      { en: "selected", ko: "선택됨" },
      { en: "unselected", ko: "선택 안 됨" },
      { en: "checked", ko: "체크됨" },
      { en: "unchecked", ko: "체크 안 됨" },
      { en: "indeterminate", ko: "중간 상태 (일부만 선택)" },
      { en: "readonly", ko: "읽기 전용" },
      { en: "editable", ko: "편집 가능" },
      { en: "highlighted", ko: "강조됨" },
      { en: "current", ko: "현재 항목" },
    ],
  },
  {
    id: "types",
    label: "컴포넌트 종류",
    terms: [
      { en: "button", ko: "버튼" },
      { en: "icon button", ko: "아이콘만 있는 버튼" },
      { en: "input", ko: "텍스트 입력 필드" },
      { en: "textarea", ko: "여러 줄 입력 필드" },
      { en: "selector", ko: "선택기 (드롭다운 등)" },
      { en: "dropdown", ko: "드롭다운" },
      { en: "select", ko: "선택 메뉴" },
      { en: "combobox", ko: "입력 + 선택 혼합" },
      { en: "checkbox", ko: "체크박스" },
      { en: "radio", ko: "라디오 버튼" },
      { en: "toggle", ko: "토글 스위치" },
      { en: "slider", ko: "슬라이더" },
      { en: "stepper", ko: "숫자 증감 입력" },
      { en: "datepicker", ko: "날짜 선택기" },
      { en: "timepicker", ko: "시간 선택기" },
      { en: "search", ko: "검색 입력" },
      { en: "tag input", ko: "태그 입력" },
      { en: "chip", ko: "칩 (선택 가능한 태그)" },
      { en: "badge", ko: "배지 (숫자/상태 표시)" },
      { en: "avatar", ko: "아바타 (프로필 이미지)" },
      { en: "tooltip", ko: "툴팁" },
      { en: "popover", ko: "팝오버" },
      { en: "modal", ko: "모달 다이얼로그" },
      { en: "drawer", ko: "사이드에서 나오는 패널" },
      { en: "sheet", ko: "아래서 올라오는 패널" },
      { en: "toast", ko: "잠깐 나왔다 사라지는 알림" },
      { en: "banner", ko: "상단/하단 알림 바" },
      { en: "alert", ko: "알림 메시지" },
      { en: "tab", ko: "탭" },
      { en: "breadcrumb", ko: "현재 경로 표시" },
      { en: "pagination", ko: "페이지 이동" },
      { en: "accordion", ko: "접었다 펼치는 목록" },
      { en: "table", ko: "테이블" },
      { en: "card", ko: "카드" },
      { en: "list item", ko: "목록 아이템" },
      { en: "menu item", ko: "메뉴 아이템" },
      { en: "divider", ko: "구분선" },
      { en: "skeleton", ko: "로딩 플레이스홀더" },
      { en: "spinner", ko: "로딩 스피너" },
      { en: "progress bar", ko: "진행 바" },
      { en: "sidebar", ko: "사이드바" },
      { en: "navbar", ko: "상단 내비게이션 바" },
      { en: "toolbar", ko: "툴바" },
    ],
  },
  {
    id: "visibility",
    label: "표시 / 가시성",
    terms: [
      { en: "visible", ko: "보임" },
      { en: "hidden", ko: "숨김" },
      { en: "open", ko: "열림" },
      { en: "closed", ko: "닫힘" },
      { en: "expanded", ko: "펼쳐짐" },
      { en: "collapsed", ko: "접혀짐" },
      { en: "show", ko: "표시" },
      { en: "hide", ko: "숨기기" },
      { en: "overlay", ko: "오버레이" },
      { en: "modal", ko: "모달" },
      { en: "tooltip", ko: "툴팁" },
      { en: "popover", ko: "팝오버" },
    ],
  },
  {
    id: "loading",
    label: "로딩 / 비동기",
    terms: [
      { en: "loading", ko: "로딩 중" },
      { en: "pending", ko: "대기 중" },
      { en: "fetching", ko: "데이터 가져오는 중" },
      { en: "idle", ko: "대기 상태 (아직 시작 안 함)" },
      { en: "processing", ko: "처리 중" },
      { en: "submitting", ko: "제출 중" },
      { en: "uploading", ko: "업로드 중" },
      { en: "downloading", ko: "다운로드 중" },
      { en: "refreshing", ko: "새로고침 중" },
      { en: "saving", ko: "저장 중" },
      { en: "skeleton", ko: "스켈레톤 (로딩 플레이스홀더)" },
    ],
  },
  {
    id: "result",
    label: "성공 / 실패 / 결과",
    terms: [
      { en: "success", ko: "성공" },
      { en: "error", ko: "에러" },
      { en: "warning", ko: "경고" },
      { en: "info", ko: "정보" },
      { en: "failed", ko: "실패" },
      { en: "rejected", ko: "거부됨" },
      { en: "fulfilled", ko: "완료됨" },
      { en: "resolved", ko: "처리 완료" },
      { en: "invalid", ko: "유효하지 않음" },
      { en: "valid", ko: "유효함" },
      { en: "timeout", ko: "시간 초과" },
    ],
  },
  {
    id: "form",
    label: "입력 / 폼",
    terms: [
      { en: "empty", ko: "비어 있음 (입력 없음)" },
      { en: "entered", ko: "입력 완료됨" },
      { en: "filled", ko: "입력됨 (내용 있음)" },
      { en: "placeholder", ko: "플레이스홀더" },
      { en: "dirty", ko: "변경됨 (저장 안 됨)" },
      { en: "pristine", ko: "미변경 상태" },
      { en: "touched", ko: "한 번 이상 입력됨" },
      { en: "untouched", ko: "아직 미입력" },
      { en: "required", ko: "필수 입력" },
      { en: "optional", ko: "선택 입력" },
      { en: "truncated", ko: "잘림 (글자 수 초과)" },
      { en: "multiline", ko: "여러 줄" },
      { en: "clearable", ko: "지우기 가능" },
    ],
  },
  {
    id: "layout",
    label: "레이아웃 / 배치",
    terms: [
      { en: "left", ko: "왼쪽 정렬" },
      { en: "center", ko: "가운데 정렬" },
      { en: "right", ko: "오른쪽 정렬" },
      { en: "leading", ko: "앞쪽 (아이콘/요소 위치)" },
      { en: "trailing", ko: "뒤쪽 (아이콘/요소 위치)" },
      { en: "prefix", ko: "앞에 붙는 요소" },
      { en: "suffix", ko: "뒤에 붙는 요소" },
      { en: "stacked", ko: "세로로 쌓임" },
      { en: "inline", ko: "가로로 나란히" },
      { en: "compact", ko: "컴팩트 (좁은 간격)" },
      { en: "comfortable", ko: "넉넉한 간격" },
      { en: "spacious", ko: "여유 있는 간격" },
      { en: "full-width", ko: "전체 너비" },
      { en: "fixed", ko: "고정됨" },
      { en: "sticky", ko: "스크롤해도 고정" },
      { en: "pinned", ko: "고정됨 (테이블 컬럼 등)" },
    ],
  },
  {
    id: "size",
    label: "사이즈 / 변형",
    terms: [
      { en: "xs", ko: "아주 작음" },
      { en: "sm", ko: "작음" },
      { en: "md", ko: "중간 (기본)" },
      { en: "lg", ko: "큼" },
      { en: "xl", ko: "아주 큼" },
      { en: "primary", ko: "주요 (메인 액션)" },
      { en: "secondary", ko: "보조" },
      { en: "tertiary", ko: "세 번째 단계" },
      { en: "ghost", ko: "고스트 (배경 없음)" },
      { en: "outline", ko: "아웃라인 (테두리만)" },
      { en: "filled", ko: "채워진" },
      { en: "tonal", ko: "톤 변형" },
      { en: "link", ko: "링크처럼 보이는 버튼" },
      { en: "destructive", ko: "파괴적 액션 (삭제 등)" },
    ],
  },
  {
    id: "data",
    label: "데이터 / 목록",
    terms: [
      { en: "empty state", ko: "데이터 없음 상태" },
      { en: "no results", ko: "검색 결과 없음" },
      { en: "populated", ko: "데이터 있음" },
      { en: "filtered", ko: "필터 적용됨" },
      { en: "sorted", ko: "정렬됨" },
      { en: "paginated", ko: "페이지 나뉨" },
      { en: "virtualized", ko: "가상화됨 (긴 목록 최적화)" },
      { en: "grouped", ko: "그룹화됨" },
      { en: "nested", ko: "중첩됨 (트리 구조)" },
      { en: "truncated", ko: "잘림 (더보기 필요)" },
      { en: "overflow", ko: "넘침" },
      { en: "placeholder", ko: "임시 데이터" },
    ],
  },
  {
    id: "auth",
    label: "인증 / 권한",
    terms: [
      { en: "authenticated", ko: "인증됨 (로그인)" },
      { en: "unauthenticated", ko: "미인증 (비로그인)" },
      { en: "authorized", ko: "권한 있음" },
      { en: "unauthorized", ko: "권한 없음" },
      { en: "expired", ko: "만료됨" },
      { en: "locked", ko: "잠김" },
      { en: "verified", ko: "인증/검증됨" },
      { en: "unverified", ko: "미검증" },
      { en: "guest", ko: "게스트 (비로그인 사용자)" },
    ],
  },
  {
    id: "network",
    label: "네트워크 / 연결",
    terms: [
      { en: "online", ko: "온라인" },
      { en: "offline", ko: "오프라인" },
      { en: "connected", ko: "연결됨" },
      { en: "disconnected", ko: "연결 끊김" },
      { en: "reconnecting", ko: "재연결 중" },
      { en: "synced", ko: "동기화됨" },
      { en: "unsynced", ko: "동기화 안 됨" },
      { en: "retrying", ko: "재시도 중" },
      { en: "stale", ko: "오래된 데이터" },
      { en: "cached", ko: "캐시됨" },
    ],
  },
];

function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;";
    ta.setAttribute("readonly", "");
    document.body.appendChild(ta);
    ta.focus({ preventScroll: true });
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    if (ok) {
      resolve();
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(resolve).catch(reject);
    } else {
      reject();
    }
  });
}

export default function App() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleCopy = (text: string, uid: string) => {
    copyToClipboard(text).then(() => {
      setCopied(uid);
      setTimeout(() => setCopied(null), 1000);
    });
  };

  const filtered = search.trim()
    ? categories
        .map((cat) => ({
          ...cat,
          terms: cat.terms.filter(
            (t) =>
              t.en.toLowerCase().includes(search.toLowerCase()) ||
              t.ko.includes(search)
          ),
        }))
        .filter((c) => c.terms.length > 0)
    : activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 pt-5 pb-3">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h1
              className="text-base font-semibold text-gray-900 tracking-tight"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              UI State Cheatsheet
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              클릭하면 바로 복사 · 피그마 작업할 때 참고용
            </p>
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveCategory(null);
            }}
            placeholder="검색 (한글 or 영어)"
            className="w-full sm:w-72 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors mb-3"
          />

          {/* Category pills */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => { setActiveCategory(null); setSearch(""); }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                !activeCategory && !search
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id === activeCategory ? null : cat.id);
                  setSearch("");
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-6 pb-16">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300">
            <p className="text-sm">검색 결과가 없어요</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((cat) => (
              <div key={cat.id}>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                  {cat.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {cat.terms.map((term) => {
                    const uid = `${cat.id}-${term.en}`;
                    const isCopied = copied === uid;
                    return (
                      <button
                        key={uid}
                        onClick={() => handleCopy(term.en, uid)}
                        className="group text-left rounded-xl border border-gray-150 bg-gray-50 hover:border-gray-300 hover:bg-white px-4 py-3.5 transition-all duration-100 cursor-pointer"
                      >
                        <p
                          className="text-base font-semibold leading-tight text-gray-900 flex items-center gap-1.5"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {term.en}
                          {isCopied && <span className="text-sm text-gray-400 font-normal">✓</span>}
                        </p>
                        <p className="text-sm text-gray-400 mt-1 leading-tight">
                          {term.ko}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
