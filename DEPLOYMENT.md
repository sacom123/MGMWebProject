# 목구멍 웹사이트 배포 가이드

## 📋 배포 전 체크리스트

### 1. Firebase 프로젝트 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. 프로젝트 설정에서 웹 앱 추가
3. Firebase 구성 정보 복사

### 2. 환경 변수 설정
1. `.env.local.example` 파일을 `.env.local`로 복사
2. Firebase 구성 정보를 `.env.local`에 입력
3. AI API 키 설정 (챗봇 기능 사용 시)

\`\`\`bash
cp .env.local.example .env.local
# .env.local 파일을 편집하여 실제 값 입력
\`\`\`

### 3. Firebase CLI 설치 및 로그인
\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init
\`\`\`

### 4. Firestore 데이터베이스 설정
1. Firebase Console에서 Firestore Database 생성
2. 보안 규칙 배포:
\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

### 5. 초기 데이터 입력
Firestore에 다음 컬렉션 생성 및 데이터 입력:
- `menuItems`: 메뉴 정보 (미박 삼겹살, 목살, 갈비본살)
- `branches`: 매장 정보
- `faqs`: 자주 묻는 질문

### 6. 로컬 개발 서버 실행
\`\`\`bash
npm install
npm run dev
\`\`\`
브라우저에서 http://localhost:3000 접속

### 7. Vercel 배포 (권장)
\`\`\`bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
\`\`\`

Vercel 대시보드에서 환경 변수 설정:
- Settings → Environment Variables
- `.env.local`의 모든 변수 추가

### 8. Firebase Hosting 배포 (대안)
\`\`\`bash
# Next.js 정적 빌드
npm run build

# Firebase에 배포
firebase deploy --only hosting
\`\`\`

## 🔧 배포 후 설정

### Google Analytics 4 설정
1. GA4 속성 생성
2. 측정 ID를 `.env.local`에 추가
3. Firebase Console에서 Google Analytics 연동

### 도메인 연결
- Vercel: Settings → Domains
- Firebase: Hosting → Add custom domain

## 📊 모니터링
- Firebase Console: 실시간 데이터베이스 사용량
- Vercel Analytics: 트래픽 및 성능
- Google Analytics: 사용자 행동 분석

## 🆘 문제 해결
- Firebase 연결 오류: 환경 변수 확인
- 빌드 오류: `npm run build` 로그 확인
- 챗봇 작동 안 함: AI API 키 및 엔드포인트 확인
