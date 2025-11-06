# Azure VM 배포 가이드

이 가이드는 Azure VM에서 Docker를 사용하여 목구멍 웹사이트를 배포하고, 로컬 코드 변경 시 자동으로 반영하는 방법을 설명합니다.

## 📋 전제 조건

- Azure VM (Ubuntu 20.04+ 권장)
- SSH 접근 권한
- GitHub 계정 및 저장소
- 로컬에 Docker 및 Docker Compose 설치

## 🎯 배포 방법 선택

### 방법 1: 개발 환경 (Hot Reload) - 빠른 반복 개발

로컬에서 코드를 수정하면 VM에서 즉시 반영됩니다.

#### 1-1. VM에서 직접 개발 (권장)

```bash
# VM에 SSH 접속
ssh azureuser@<VM_IP>

# VM에서 스크립트 실행
bash scripts/setup-vm-direct.sh

# 코드를 VM에 복사 (로컬에서)
scp -r . azureuser@<VM_IP>:/opt/mokgumeong-bbq/

# VM에 SSH 접속하여 .env 파일 생성
ssh azureuser@<VM_IP>
cd /opt/mokgumeong-bbq
nano .env  # 환경 변수 설정
```

`.env` 파일 예시:

```env
HYPERFLOW_API_KEY=your_api_key
HYPERFLOW_FLOWGRAPH_ID=your_flowgraph_id
NEXT_PUBLIC_HYPERFLOW_FLOWGRAPH_ID=your_flowgraph_id
```

```bash
# 개발 서버 시작 (Hot Reload 활성화)
cd /opt/mokgumeong-bbq
docker-compose -f docker-compose.dev.yml up -d

# 로그 확인
docker-compose -f docker-compose.dev.yml logs -f
```

#### 1-2. 로컬에서 볼륨 마운트 (SSHFS 사용)

```bash
# 로컬에서 SSHFS 설치
brew install sshfs  # macOS
# sudo apt-get install sshfs  # Linux

# VM 디렉토리 마운트
mkdir ~/vm-mount
sshfs azureuser@<VM_IP>:/opt/mokgumeong-bbq ~/vm-mount

# 마운트된 디렉토리에서 개발
cd ~/vm-mount
# 코드 수정 시 VM에서 자동 반영됨
```

### 방법 2: 프로덕션 환경 (GitHub Actions 자동 배포)

코드를 GitHub에 푸시하면 자동으로 빌드되고 VM에 배포됩니다.

#### 2-1. GitHub Secrets 설정

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. 다음 Secrets 추가:
   - `AZURE_CREDENTIALS`: Azure 서비스 주체 JSON
   - `VM_USER`: VM 사용자명 (예: `azureuser`)
   - `VM_IP`: VM IP 주소
   - `GITHUB_TOKEN`: GitHub Personal Access Token (packages:write 권한)

#### 2-2. Azure 서비스 주체 생성

```bash
az ad sp create-for-rbac --name "mokgumeong-deploy" \
  --role contributor \
  --scopes /subscriptions/<subscription-id> \
  --sdk-auth
```

출력된 JSON을 `AZURE_CREDENTIALS`에 저장합니다.

#### 2-3. VM 초기 설정

```bash
# 로컬에서 실행
export VM_USER=azureuser
export VM_IP=<your-vm-ip>
export GITHUB_TOKEN=<your-github-token>
export GITHUB_REPO=your-username/mokgumeong-bbq

bash scripts/deploy-vm.sh
```

#### 2-4. 자동 배포 활성화

이제 `main` 또는 `develop` 브랜치에 푸시하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "Update code"
git push origin main
```

Watchtower가 30초마다 새 이미지를 확인하고 자동 업데이트합니다.

## 🔧 환경 변수 설정

VM에서 `.env` 파일 생성:

```bash
ssh azureuser@<VM_IP>
cd /opt/mokgumeong-bbq
nano .env
```

필수 환경 변수:

```env
# Hyperflow
HYPERFLOW_API_KEY=your_api_key
HYPERFLOW_FLOWGRAPH_ID=your_flowgraph_id
NEXT_PUBLIC_HYPERFLOW_FLOWGRAPH_ID=your_flowgraph_id

# Firebase (선택사항)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... 기타 Firebase 설정
```

## 📦 Docker Compose 명령어

### 개발 환경

```bash
# 시작
docker-compose -f docker-compose.dev.yml up -d

# 중지
docker-compose -f docker-compose.dev.yml down

# 로그 확인
docker-compose -f docker-compose.dev.yml logs -f

# 재시작
docker-compose -f docker-compose.dev.yml restart
```

### 프로덕션 환경

```bash
# 시작
docker-compose -f docker-compose.prod.yml up -d

# 최신 이미지로 업데이트
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# 중지
docker-compose -f docker-compose.prod.yml down

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔍 문제 해결

### 포트가 이미 사용 중

```bash
# 포트 확인
sudo netstat -tulpn | grep 3000

# 다른 포트 사용 (docker-compose.yml 수정)
ports:
  - "3001:3000"  # 3001로 변경
```

### 컨테이너가 시작되지 않음

```bash
# 로그 확인
docker-compose -f docker-compose.dev.yml logs

# 컨테이너 상태 확인
docker ps -a
```

### 환경 변수 문제

```bash
# .env 파일 확인
cat .env

# 환경 변수 확인
docker-compose -f docker-compose.dev.yml config
```

### Watchtower가 작동하지 않음

```bash
# Watchtower 로그 확인
docker logs watchtower

# Watchtower 재시작
docker restart watchtower
```

## 🌐 방화벽 설정

Azure Portal에서 VM의 네트워크 보안 그룹에 다음 규칙 추가:

- **인바운드 규칙**: 포트 3000 (HTTP)
- **인바운드 규칙**: 포트 22 (SSH)

## 📊 모니터링

```bash
# 리소스 사용량 확인
docker stats

# 디스크 사용량 확인
df -h

# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps
```

## 🔄 업데이트 프로세스

### 개발 환경

코드 수정 → 저장 → 자동 반영 (Hot Reload)

### 프로덕션 환경

코드 수정 → Git 커밋 → Push → GitHub Actions 빌드 → Watchtower 자동 업데이트

## 🚀 다음 단계

1. Nginx 리버스 프록시 설정 (선택)
2. SSL 인증서 설정 (Let's Encrypt)
3. 도메인 연결
4. 모니터링 및 로깅 설정
