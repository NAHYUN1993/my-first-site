# 🤖 AI를 위한 프로젝트 구조 설명서

> 이 문서는 AI (ChatGPT, Claude, Gemini 등)가 이 프로젝트를 빠르게 이해하고 수정할 수 있도록 작성되었습니다.

## 📁 프로젝트 개요

- **프로젝트 타입**: Next.js 15 포트폴리오 템플릿
- **주요 기술**: Next.js, TypeScript, Tailwind CSS v4, Framer Motion
- **목적**: 비개발자도 쉽게 수정 가능한 한국어 포트폴리오 템플릿
- **제작자**: 백상 (@Mrbaeksang95) - https://devcom.kr/

## 🎯 핵심 특징

1. **비개발자 친화적**: 모든 수정 가능한 부분에 한글 주석과 가이드 포함
2. **조건부 렌더링**: 빈 문자열("")이나 false로 설정하면 자동으로 숨김
3. **반응형 디자인**: 모바일/태블릿/데스크톱 자동 대응
4. **다크모드 지원**: 자동 테마 전환
5. **한글 QR코드**: vCard 형식으로 한글 이름 완벽 지원

## 📂 폴더 구조

```
vibeCoding/
├── app/                    # Next.js 앱 라우터
│   ├── layout.tsx         # 루트 레이아웃 (폰트, 메타데이터)
│   ├── page.tsx          # 메인 페이지 (섹션 조합)
│   └── globals.css       # 전역 스타일
│
├── components/           # React 컴포넌트들
│   ├── header.tsx       # 네비게이션 바 설정 ⭐
│   ├── hero.tsx         # 메인 화면 섹션 ⭐
│   ├── about.tsx        # 소개 섹션 ⭐
│   ├── projects.tsx     # 프로젝트 갤러리 ⭐
│   ├── contact.tsx      # 연락처 & QR코드 ⭐
│   ├── footer.tsx       # 푸터 섹션 ⭐
│   ├── navbar.tsx       # 네비게이션 바 컴포넌트
│   ├── theme-toggle.tsx # 다크모드 토글
│   └── ui/              # UI 기본 컴포넌트
│       ├── button.tsx   # 버튼
│       ├── card.tsx     # 카드
│       └── toast/       # 토스트 알림
│
├── public/              # 정적 파일 (이미지)
│   ├── profile.jpg     # 프로필 사진
│   ├── background.jpg  # 배경 이미지
│   └── project*.jpg    # 프로젝트 이미지들
│
└── lib/                # 유틸리티 함수
    └── utils.ts        # 클래스명 병합 유틸
```

## 🔧 각 파일별 수정 방법

### ⭐ 주요 수정 파일들 (비개발자용)

#### 1. `components/hero.tsx` - 메인 화면
```typescript
const heroInfo = {
  greeting: "안녕하세요",        // 인사말
  name: "홍길동입니다",          // 이름
  title: "마케터",              // 직업
  profileImage: "/profile.jpg",  // 프로필 사진 (public 폴더)
  // 소셜 링크 (빈 문자열이면 자동 숨김)
  instagram: "https://...",
  youtube: "",  // 사용 안함
}
```

#### 2. `components/about.tsx` - 소개 섹션
```typescript
const aboutInfo = {
  title: "소개",
  subtitle: "10년차 마케팅 전문가",
  description: "자기소개...",
  skills: ["마케팅", "기획", "분석"],  // 스킬 목록
  backgroundImage: "",  // 배경 이미지 (선택)
}
```

#### 3. `components/projects.tsx` - 프로젝트 갤러리
```typescript
const projectsInfo = {
  projects: [
    {
      image: "/project1.jpg",  // 이미지 경로
      title: "프로젝트 제목",
      description: "설명"
    },
    // ... 최대 20개까지 추가 가능
    // 빈 항목은 자동으로 숨김
  ]
}
```

#### 4. `components/contact.tsx` - 연락처
```typescript
const contactInfo = {
  name: "홍길동",
  phone: "010-1234-5678",
  email: "hello@example.com",
  // QR코드 자동 생성됨
}
```

#### 5. `components/footer.tsx` - 푸터
```typescript
const footerInfo = {
  showFooter: true,  // false면 푸터 전체 숨김
  name: "홍길동",
  showTemplateCredit: true,  // 템플릿 제작자 크레딧
}
```

#### 6. `components/header.tsx` - 네비게이션 설정
```typescript
const navConfig = {
  logo: "Portfolio",
  items: [
    { name: "홈", url: "#hero", icon: Home, show: true },
    // show: false로 메뉴 숨기기 가능
  ]
}
```

## 🎨 스타일 수정 방법

### 색상 테마
- **파일**: `app/globals.css`
- **CSS 변수**: `:root`와 `.dark`에서 색상 정의
- 주요 색상:
  - `--primary`: 주 색상
  - `--background`: 배경색
  - `--foreground`: 텍스트 색상

### Tailwind 클래스
- 모든 스타일은 Tailwind CSS 클래스 사용
- 반응형: `md:`, `lg:` 접두사
- 다크모드: `dark:` 접두사

## 💡 중요한 패턴들

### 1. 조건부 렌더링
```typescript
// 빈 문자열이면 자동 숨김
{instagram && <InstagramIcon />}

// false면 섹션 전체 숨김
{showFooter && <Footer />}
```

### 2. 이미지 처리
- 모든 이미지는 `/public` 폴더에 저장
- 경로는 `/`로 시작 (예: `/profile.jpg`)
- 이미지 없으면 자동으로 placeholder 표시

### 3. 배열 필터링
```typescript
// 빈 항목 자동 제거
const validProjects = projects.filter(p => p.image)
```

### 4. 한글 인코딩
```typescript
// QR코드용 한글 인코딩
encodeURIComponent(vCardString.trim())
```

## 🚀 빌드 & 배포

### 개발 서버
```bash
npm run dev
# http://localhost:3000
```

### 프로덕션 빌드
```bash
npm run build
npm run start
```

### 배포 플랫폼
- Vercel (추천) - Next.js 자동 최적화
- Netlify
- GitHub Pages (정적 export 필요)

## ⚠️ 주의사항

1. **파일 저장**: 수정 후 반드시 Ctrl+S로 저장
2. **이미지 크기**: 
   - 프로필: 500x500px (정사각형)
   - 프로젝트: 1920x1080px (16:9) 권장
   - 최대 2MB 권장
3. **문자열 규칙**:
   - 빈 값: `""` (빈 따옴표)
   - 사용 안함: `false`
   - 배열 마지막: 쉼표 없음
4. **한글 깨짐**: UTF-8 인코딩 확인

## 🔍 디버깅 팁

### 일반적인 오류들
1. **"Expression expected"**: 쉼표나 중괄호 확인
2. **이미지 안 보임**: 파일명과 경로 확인
3. **섹션 안 보임**: show 속성이 false인지 확인
4. **스타일 안 됨**: className 오타 확인

### 콘솔 확인
```javascript
// 브라우저 개발자 도구 (F12)
console.log(projectsInfo)  // 데이터 확인
```

## 📝 추가 문서

- `수정가이드.md`: 비개발자를 위한 상세 가이드
- `README.md`: 프로젝트 소개 및 설치 방법

## 🤝 기여 방법

이 템플릿은 오픈소스입니다. 개선사항이나 버그를 발견하면:
1. GitHub Issues에 등록
2. Pull Request 제출
3. 제작자 연락: https://devcom.kr/

---

**템플릿 제작**: 백상 (@Mrbaeksang95)
**YouTube**: https://www.youtube.com/@Mrbaeksang95
**Website**: https://devcom.kr/