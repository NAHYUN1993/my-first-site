# 🎨 VibeCoding - 인라인 편집 포트폴리오 템플릿

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</div>

<br />

> 🚀 **개발자가 아니어도 쉽게 수정 가능한 포트폴리오 템플릿**  
> 인라인 편집 기능으로 실시간으로 내용을 수정하고, 이미지를 업로드하고, 레이아웃을 커스터마이징하세요.

<br />

## ✨ 주요 기능

### 🎯 **인라인 편집 시스템**
- **Ctrl + E** 또는 **편집 버튼**으로 편집 모드 활성화
- 텍스트, 이미지, 아이콘을 클릭해서 바로 수정
- 변경사항 자동 저장 (localStorage)
- 개발 모드에서 파일 시스템 저장 지원

### 📱 **완벽한 반응형 디자인**
- 모바일, 태블릿, 데스크톱 최적화
- 다크모드/라이트모드 지원
- 부드러운 애니메이션과 트랜지션

### 🎨 **커스터마이징 가능한 섹션**
- **Hero**: 인삿말, 프로필 이미지, 소셜 링크
- **About**: 경험, 스킬, 스토리, 취미
- **Projects**: 프로젝트 갤러리 (이미지/비디오)
- **Contact**: 연락처 정보, QR 코드, 문의 양식

### 🔥 **스마트한 기능들**
- 의미있는 파일명 자동 생성 (hero-profile, about-background 등)
- 기존 파일 자동 삭제로 저장 공간 관리
- QR 코드로 연락처 저장 (vCard 3.0)
- 푸터 네비게이션 자동 동기화
- SNS 공유 시 프로필 이미지 자동 썸네일 (Open Graph)

<br />

## 🚀 빠른 시작

### 1. 설치

```bash
# 저장소 클론
git clone https://github.com/Mrbaeksang/my-site-template.git

# 브랜치 확인 (기본 브랜치는 main입니다)
cd my-site-template
git branch

# 만약 master 브랜치에 있다면 main으로 전환
git checkout main

# 또는 처음부터 main 브랜치 지정하여 클론
git clone -b main https://github.com/Mrbaeksang/my-site-template.git
cd my-site-template

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

### 2. 편집 모드 사용법

1. **편집 모드 켜기**
   - 개발 환경: `Ctrl + E` 또는 우하단 ✏️ 버튼 클릭
   - 편집 가능한 요소에 마우스를 올리면 편집 아이콘이 나타남

2. **텍스트 편집**
   - 텍스트에 마우스 호버 → 편집 아이콘 클릭
   - 내용 수정 → Enter 또는 ✓ 버튼으로 저장
   - Esc 또는 × 버튼으로 취소

3. **이미지/비디오 업로드**
   - 미디어 요소 호버 → 설정 아이콘 클릭
   - 파일 선택 또는 URL 입력
   - 자동으로 최적화된 파일명으로 저장

4. **배경 설정**
   - 각 섹션 상단의 설정 아이콘 클릭
   - 이미지/비디오/색상 중 선택
   - 투명도 조절 가능

<br />

## 📁 프로젝트 구조

```
vibecoding/
├── app/                    # Next.js App Router
│   ├── api/               # API 엔드포인트
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
│
├── components/            
│   ├── editable/          # 인라인 편집 컴포넌트
│   │   ├── editable-text.tsx
│   │   ├── editable-media.tsx
│   │   ├── editable-background.tsx
│   │   └── editable-icon.tsx
│   │
│   ├── ui/                # UI 컴포넌트
│   ├── hero.tsx           # 히어로 섹션
│   ├── about.tsx          # 소개 섹션
│   ├── projects.tsx       # 프로젝트 섹션
│   ├── contact.tsx        # 연락처 섹션
│   ├── header.tsx         # 헤더
│   ├── navbar.tsx         # 네비게이션
│   └── footer.tsx         # 푸터
│
├── contexts/              
│   └── inline-editor-context.tsx  # 편집 상태 관리
│
├── lib/                   # 유틸리티
├── hooks/                 # 커스텀 훅
└── public/               
    └── uploads/           # 업로드된 파일
```

<br />

## 🎨 커스터마이징

### 색상 테마 변경

`app/globals.css`에서 CSS 변수를 수정하세요:

```css
:root {
  --primary: 221.2 83.2% 53.3%;      /* 메인 색상 */
  --primary-foreground: 210 40% 98%; /* 메인 텍스트 색상 */
  --background: 0 0% 100%;           /* 배경색 */
  --foreground: 222.2 84% 4.9%;      /* 텍스트 색상 */
}
```

### 섹션 추가/제거

`app/page.tsx`에서 섹션을 관리하세요:

```tsx
export default function Page() {
  return (
    <>
      <Header />      {/* 헤더 네비게이션 */}
      <Hero />        {/* 히어로 섹션 */}
      <About />       {/* 소개 섹션 */}
      <Projects />    {/* 프로젝트 섹션 */}
      <Contact />     {/* 연락처 섹션 */}
      <Footer />      {/* 푸터 */}
    </>
  )
}
```

### 기본값 설정

각 컴포넌트의 `defaultInfo` 객체를 수정하세요:

```typescript
// components/hero.tsx
const defaultInfo = {
  greeting: "안녕하세요,",
  name: "홍길동입니다",
  title: "프론트엔드 개발자",
  description: "창의적인 웹 경험을 만듭니다"
}
```

<br />

## 🛠 기술 스택

- **Framework**: [Next.js 15](https://nextjs.org/) - React 프레임워크
- **Language**: [TypeScript](https://www.typescriptlang.org/) - 타입 안정성
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 CSS
- **Icons**: [Lucide React](https://lucide.dev/) - 아이콘 라이브러리
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) - 다크모드
- **QR Code**: [qrcode](https://www.npmjs.com/package/qrcode) - QR 코드 생성

<br />

## 📝 환경 변수

`.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```env
# 개발 환경 설정
NODE_ENV=development

# 추가 설정 (선택사항)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

<br />

## 🚢 배포

### Vercel (추천)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vibecoding)

1. 위 버튼 클릭 또는 [Vercel](https://vercel.com)에서 직접 임포트
2. 환경 변수 설정
3. 배포 완료!

### 다른 플랫폼

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

<br />

## 🤝 기여하기

기여는 언제나 환영입니다! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br />

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

<br />

## 👨‍💻 제작자

**백상 (Mrbaeksang)**
- YouTube: [@Mrbaeksang95](https://www.youtube.com/@Mrbaeksang95)
- Website: [devcom.kr](https://devcom.kr/)
- Email: qortkdgus95@gmail.com

<br />

## 🙏 감사의 말

이 템플릿이 도움이 되었다면 ⭐️ 스타를 눌러주세요!

<br />

---

<div align="center">
  Made with ❤️ by Mrbaeksang
</div>