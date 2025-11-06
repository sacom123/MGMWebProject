# Docker & Azure 배포 가이드

목구멍 웹사이트를 Docker 컨테이너로 만들어 Azure에 배포하는 방법입니다.

## 📋 사전 요구사항

1. **Docker Desktop** 설치
   - [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop)
   - 설치 후 Docker가 실행 중인지 확인

2. **Azure CLI** 설치
   - [Azure CLI 설치 가이드](https://docs.microsoft.com/cli/azure/install-azure-cli)
   - 설치 확인: `az --version`

3. **Azure 계정**
   - [Azure 무료 계정 생성](https://azure.microsoft.com/free/)

## 🚀 배포 단계

### 1단계: 프로젝트 다운로드

v0에서 ZIP 파일로 다운로드하거나 GitHub에서 클론합니다.

\`\`\`bash
# ZIP 다운로드 후 압축 해제
unzip mokgumeong-website.zip
cd mokgumeong-website
\`\`\`

### 2단계: 환경 변수 설정

`.env.local.example` 파일을 `.env.local`로 복사하고 Firebase 정보를 입력합니다.

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

`.env.local` 파일 편집:
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... 나머지 Firebase 설정
\`\`\`

### 3단계: 로컬에서 Docker 테스트

\`\`\`bash
# Docker 이미지 빌드
docker build -t mokgumeong-web .

# 로컬에서 컨테이너 실행
docker run -p 3000:3000 --env-file .env.local mokgumeong-web

# 브라우저에서 http://localhost:3000 접속하여 확인
\`\`\`

또는 Docker Compose 사용:

\`\`\`bash
# docker-compose로 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
\`\`\`

### 4단계: Azure에 로그인

\`\`\`bash
# Azure CLI로 로그인
az login

# 구독 확인
az account list --output table

# 사용할 구독 설정 (필요한 경우)
az account set --subscription "your-subscription-id"
\`\`\`

### 5단계: Azure에 배포

#### 방법 A: 자동 배포 스크립트 사용 (권장)

\`\`\`bash
# 배포 스크립트에 실행 권한 부여
chmod +x deploy-azure.sh

# 배포 실행
./deploy-azure.sh
\`\`\`

#### 방법 B: 수동 배포

\`\`\`bash
# 1. 리소스 그룹 생성
az group create --name mokgumeong-rg --location koreacentral

# 2. Azure Container Registry 생성
az acr create \
  --resource-group mokgumeong-rg \
  --name mokgumeongacr \
  --sku Basic \
  --admin-enabled true

# 3. ACR에 로그인
az acr login --name mokgumeongacr

# 4. 이미지 빌드 및 푸시
docker build -t mokgumeong-web .
docker tag mokgumeong-web mokgumeongacr.azurecr.io/mokgumeong-web:latest
docker push mokgumeongacr.azurecr.io/mokgumeong-web:latest

# 5. Container App 환경 생성
az containerapp env create \
  --name mokgumeong-env \
  --resource-group mokgumeong-rg \
  --location koreacentral

# 6. Container App 배포
az containerapp create \
  --name mokgumeong-web \
  --resource-group mokgumeong-rg \
  --environment mokgumeong-env \
  --image mokgumeongacr.azurecr.io/mokgumeong-web:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server mokgumeongacr.azurecr.io \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3
\`\`\`

### 6단계: 환경 변수 설정 (Azure)

\`\`\`bash
# Firebase 환경 변수 설정
az containerapp update \
  --name mokgumeong-web \
  --resource-group mokgumeong-rg \
  --set-env-vars \
    "NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key" \
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain" \
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id"
\`\`\`

### 7단계: 배포 확인

\`\`\`bash
# 애플리케이션 URL 확인
az containerapp show \
  --name mokgumeong-web \
  --resource-group mokgumeong-rg \
  --query properties.configuration.ingress.fqdn \
  --output tsv
\`\`\`

브라우저에서 출력된 URL로 접속하여 확인합니다.

## 🔄 업데이트 배포

코드를 수정한 후 다시 배포하려면:

\`\`\`bash
# 1. 새 이미지 빌드
docker build -t mokgumeong-web .

# 2. ACR에 푸시
docker tag mokgumeong-web mokgumeongacr.azurecr.io/mokgumeong-web:latest
docker push mokgumeongacr.azurecr.io/mokgumeong-web:latest

# 3. Container App 업데이트 (자동으로 새 이미지 pull)
az containerapp update \
  --name mokgumeong-web \
  --resource-group mokgumeong-rg \
  --image mokgumeongacr.azurecr.io/mokgumeong-web:latest
\`\`\`

## 📊 모니터링 및 로그

\`\`\`bash
# 로그 스트림 보기
az containerapp logs show \
  --name mokgumeong-web \
  --resource-group mokgumeong-rg \
  --follow

# 애플리케이션 상태 확인
az containerapp show \
  --name mokgumeong-web \
  --resource-group mokgumeong-rg \
  --query properties.runningStatus
\`\`\`

## 🔧 문제 해결

### Docker 빌드 실패
\`\`\`bash
# 캐시 없이 다시 빌드
docker build --no-cache -t mokgumeong-web .
\`\`\`

### 환경 변수 문제
\`\`\`bash
# 현재 설정된 환경 변수 확인
az containerapp show \
  --name mokgumeong-web \
  --resource-group mokgumeong-rg \
  --query properties.template.containers[0].env
\`\`\`

### 컨테이너 재시작
\`\`\`bash
az containerapp revision restart \
  --name mokgumeong-web \
  --resource-group mokgumeong-rg
\`\`\`

## 💰 비용 관리

- **Azure Container Apps**: 사용한 만큼만 과금
- **Azure Container Registry**: Basic SKU 사용 (월 약 $5)
- **무료 할당량**: 매월 180,000 vCPU-초, 360,000 GiB-초 무료

비용 절감 팁:
\`\`\`bash
# 사용하지 않을 때 스케일을 0으로 설정
az containerapp update \
  --name mokgumeong-web \
  --resource-group mokgumeong-rg \
  --min-replicas 0
\`\`\`

## 🗑️ 리소스 삭제

모든 Azure 리소스를 삭제하려면:

\`\`\`bash
az group delete --name mokgumeong-rg --yes --no-wait
\`\`\`

## 📚 추가 리소스

- [Azure Container Apps 문서](https://docs.microsoft.com/azure/container-apps/)
- [Docker 문서](https://docs.docker.com/)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
