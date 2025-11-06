# 목구멍 한식 BBQ 웹사이트

목구멍 브랜드의 공식 웹사이트입니다. Next.js와 Firebase를 기반으로 구축되었습니다.

## 🚀 주요 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **메뉴 소개**: 미박 삼겹살, 목살, 갈비본살 등 시그니처 메뉴
- **매장 찾기**: 전국 매장 위치 및 정보
- **가맹 문의**: 온라인 가맹 상담 신청
- **고객 지원**: FAQ 및 문의 시스템
- **AI 챗봇**: 실시간 고객 상담 (준비 중)

## 🛠️ 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **UI Components**: Radix UI, shadcn/ui
- **Deployment**: Vercel / Firebase Hosting

## 📦 설치 및 실행

### 1. 저장소 클론
\`\`\`bash
git clone <repository-url>
cd mokgumeong-bbq-website
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 3. 환경 변수 설정
\`\`\`bash
cp .env.local.example .env.local
# .env.local 파일을 편집하여 Firebase 설정 입력
\`\`\`

### 4. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 프로젝트 구조

\`\`\`
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 홈페이지
│   ├── brand/             # 브랜드 소개
│   ├── menu/              # 메뉴
│   ├── locations/         # 매장 찾기
│   ├── franchise/         # 가맹 문의
│   └── support/           # 고객 지원
├── components/            # React 컴포넌트
│   ├── header.tsx        # 헤더 네비게이션
│   ├── footer.tsx        # 푸터
│   └── chatbot-widget.tsx # 챗봇 위젯
├── lib/                   # 유틸리티 및 설정
│   └── firebase.ts       # Firebase 초기화
├── public/               # 정적 파일
└── firestore.rules       # Firestore 보안 규칙
\`\`\`

## 🔐 Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Firestore Database 활성화
3. 웹 앱 추가 및 구성 정보 복사
4. `.env.local`에 Firebase 구성 정보 입력

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

## 📝 라이선스

Copyright © 2025 목구멍. All rights reserved.
