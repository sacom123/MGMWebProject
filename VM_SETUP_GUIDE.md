# Azure VM 설정 가이드 (GitHub Actions 자동 배포)

이 가이드는 Azure VM에서 서버 실행 환경만 설정하는 방법을 설명합니다. 코드는 GitHub Actions가 자동으로 빌드하고 배포합니다.

## 📋 전제 조건

- Azure VM (Ubuntu 20.04+ 권장)
- SSH 접근 권한
- GitHub 저장소 설정 완료

## 🚀 1단계: VM 초기 설정

### 방법 A: 로컬에서 원격 설정 (권장)

```bash
# 1. 환경 변수 설정
export VM_USER=azureuser  # VM 사용자명
export VM_IP=<your-vm-ip>  # VM IP 주소
export GITHUB_REPO=your-username/mokgumeong-bbq  # GitHub 저장소

# 2. 초기 설정 스크립트 실행
bash scripts/deploy-vm.sh
```

### 방법 B: VM에서 직접 설정

```bash
# VM에 SSH 접속
ssh azureuser@<VM_IP>

# 초기 설정 스크립트 다운로드 및 실행
curl -o vm-setup-only.sh https://raw.githubusercontent.com/your-username/mokgumeong-bbq/main/scripts/vm-setup-only.sh
# 또는 로컬에서 복사
# scp scripts/vm-setup-only.sh azureuser@<VM_IP>:~/

bash vm-setup-only.sh
```

## 🔧 2단계: 필수 파일 설정

### docker-compose.prod.yml 복사

```bash
# 로컬에서 VM으로 복사
scp docker-compose.prod.yml azureuser@<VM_IP>:/opt/mokgumeong-bbq/
```

### .env 파일 생성

```bash
# VM에 SSH 접속
ssh azureuser@<VM_IP>
cd /opt/mokgumeong-bbq

# .env 파일 생성
cat > .env << 'EOF'
# GitHub Repository (필수 - docker-compose.prod.yml에서 사용)
GITHUB_REPOSITORY=your-username/mokgumeong-bbq

# Hyperflow Configuration (필수)
HYPERFLOW_API_KEY=your_hyperflow_api_key
HYPERFLOW_FLOWGRAPH_ID=your_flowgraph_id
NEXT_PUBLIC_HYPERFLOW_FLOWGRAPH_ID=your_flowgraph_id

# Firebase Configuration (선택사항)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
EOF

# 환경 변수 수정
nano .env
```

**중요**: `GITHUB_REPOSITORY`는 실제 GitHub 저장소 경로로 설정해야 합니다 (예: `username/mokgumeong-bbq`)

## 🔐 3단계: GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 Secrets 추가:

### 필수 Secrets

1. **VM_SSH_KEY**: VM SSH 개인 키

   ```bash
   # 로컬에서 생성
   cat ~/.ssh/id_rsa
   # 또는 새로 생성
   ssh-keygen -t rsa -b 4096 -C "github-actions"
   # 공개 키를 VM에 추가
   ssh-copy-id azureuser@<VM_IP>
   ```

2. **VM_USER**: VM 사용자명 (예: `azureuser`)

3. **VM_IP**: VM IP 주소

### 자동 생성되는 Secrets

- `GITHUB_TOKEN`: GitHub Actions에서 자동으로 제공 (별도 설정 불필요)

## 🚀 4단계: 애플리케이션 시작

```bash
# VM에 SSH 접속
ssh azureuser@<VM_IP>
cd /opt/mokgumeong-bbq

# GitHub Container Registry 로그인 (처음 한 번만)
docker login ghcr.io
# Username: your-github-username
# Password: GitHub Personal Access Token (packages:read 권한)

# 애플리케이션 시작
docker-compose -f docker-compose.prod.yml up -d

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

## ✅ 5단계: 자동 배포 확인

이제 `main` 또는 `develop` 브랜치에 코드를 푸시하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "Update code"
git push origin main
```

GitHub Actions가 다음을 수행합니다:

1. Docker 이미지 빌드
2. GitHub Container Registry에 푸시
3. VM에 SSH 접속
4. 최신 이미지 다운로드
5. 컨테이너 재시작

또는 Watchtower가 30초마다 새 이미지를 확인하고 자동 업데이트합니다.

## 📦 VM에서 관리 명령어

### 애플리케이션 상태 확인

```bash
cd /opt/mokgumeong-bbq
docker-compose -f docker-compose.prod.yml ps
```

### 로그 확인

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### 애플리케이션 재시작

```bash
docker-compose -f docker-compose.prod.yml restart
```

### 애플리케이션 중지

```bash
docker-compose -f docker-compose.prod.yml down
```

### 최신 이미지로 수동 업데이트

```bash
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Watchtower 상태 확인

```bash
docker logs watchtower
```

## 🔍 문제 해결

### 포트 3000이 이미 사용 중

```bash
# 포트 사용 확인
sudo netstat -tulpn | grep 3000

# 다른 포트 사용 (docker-compose.prod.yml 수정)
ports:
  - "3001:3000"
```

### 컨테이너가 시작되지 않음

```bash
# 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 컨테이너 상태 확인
docker ps -a
```

### 환경 변수 문제

```bash
# .env 파일 확인
cat .env

# 환경 변수 확인
docker-compose -f docker-compose.prod.yml config
```

### GitHub Container Registry 접근 권한

```bash
# 저장소 설정 확인
# GitHub 저장소 → Settings → General → Danger Zone → Change visibility
# 또는 Package 권한 확인: Settings → Packages → Package name → Manage access
```

### SSH 연결 문제

```bash
# SSH 키 권한 확인
chmod 600 ~/.ssh/id_rsa

# SSH 연결 테스트
ssh -i ~/.ssh/id_rsa azureuser@<VM_IP>
```

## 🌐 방화벽 설정

Azure Portal에서 VM의 네트워크 보안 그룹에 다음 규칙 추가:

- **인바운드 규칙**: 포트 3000 (HTTP) - Source: Any
- **인바운드 규칙**: 포트 22 (SSH) - Source: Your IP

## 📊 모니터링

```bash
# 리소스 사용량 확인
docker stats

# 디스크 사용량 확인
df -h

# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps
```

## 🔄 배포 프로세스

1. **로컬에서 코드 수정**
2. **Git 커밋 및 푸시**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. **GitHub Actions 자동 빌드**
   - Docker 이미지 빌드
   - GitHub Container Registry에 푸시
4. **VM에 자동 배포**
   - GitHub Actions가 VM에 SSH 접속
   - 최신 이미지 다운로드
   - 컨테이너 재시작
5. **또는 Watchtower 자동 감지**
   - 30초마다 새 이미지 확인
   - 자동 업데이트

## ✅ 완료

이제 VM은 서버 실행만 담당하며, 모든 코드 변경은 GitHub Actions를 통해 자동으로 배포됩니다!
