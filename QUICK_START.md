# 🚀 빠른 시작 가이드

이 가이드는 처음부터 끝까지 단계별로 안내합니다.

## ✅ 체크리스트

### 1단계: 사전 준비 확인

- [ ] Azure VM 생성 완료 및 IP 주소 확인
- [ ] GitHub 저장소 생성 완료
- [ ] 로컬에서 VM에 SSH 접속 가능한지 확인
- [ ] 환경 변수 값 준비 (HYPERFLOW_API_KEY, HYPERFLOW_FLOWGRAPH_ID 등)

### 2단계: GitHub Secrets 설정

- [ ] VM_SSH_KEY 생성 및 추가
- [ ] VM_USER 추가
- [ ] VM_IP 추가

### 3단계: VM 초기 설정

- [ ] VM에 Docker 설치
- [ ] docker-compose.prod.yml 복사
- [ ] .env 파일 생성

### 4단계: 애플리케이션 시작

- [ ] GitHub Container Registry 로그인
- [ ] Docker 컨테이너 시작

### 5단계: 자동 배포 테스트

- [ ] 코드 수정 후 푸시
- [ ] GitHub Actions 실행 확인

---

## 📋 상세 단계별 가이드

### 1단계: Azure VM 확인

```bash
# VM IP 주소 확인 (Azure Portal에서)
# VM 사용자명 확인 (보통 azureuser 또는 ubuntu)
```

**확인 사항:**
- VM IP 주소: `_______`
- VM 사용자명: `_______`
- SSH 접속 가능 여부: `_______`

### 2단계: SSH 키 생성 및 설정

```bash
# 로컬에서 SSH 키 생성 (아직 없다면)
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy"

# 공개 키를 VM에 복사
ssh-copy-id -i ~/.ssh/id_rsa.pub azureuser@<VM_IP>

# 또는 수동으로 복사
cat ~/.ssh/id_rsa.pub
# 출력된 내용을 VM의 ~/.ssh/authorized_keys에 추가

# SSH 접속 테스트
ssh azureuser@<VM_IP>
```

**확인 사항:**
- SSH 키 생성 완료: `_______`
- VM에 공개 키 추가 완료: `_______`
- SSH 접속 테스트 성공: `_______`

### 3단계: GitHub Secrets 설정

1. GitHub 저장소로 이동
2. **Settings** → **Secrets and variables** → **Actions** 클릭
3. **New repository secret** 클릭

#### Secret 1: VM_SSH_KEY
```bash
# 로컬에서 개인 키 내용 복사
cat ~/.ssh/id_rsa
# 전체 내용 복사 (-----BEGIN OPENSSH PRIVATE KEY----- 부터 -----END OPENSSH PRIVATE KEY----- 까지)
```
- Name: `VM_SSH_KEY`
- Value: 위에서 복사한 전체 개인 키 내용

#### Secret 2: VM_USER
- Name: `VM_USER`
- Value: `azureuser` (또는 실제 VM 사용자명)

#### Secret 3: VM_IP
- Name: `VM_IP`
- Value: VM의 IP 주소 (예: `20.xxx.xxx.xxx`)

**확인 사항:**
- VM_SSH_KEY 추가 완료: `_______`
- VM_USER 추가 완료: `_______`
- VM_IP 추가 완료: `_______`

### 4단계: VM 초기 설정

```bash
# 로컬에서 실행
export VM_USER=azureuser  # VM 사용자명
export VM_IP=<your-vm-ip>  # VM IP 주소
export GITHUB_REPO=$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')  # 자동 감지

# 또는 수동으로 설정
export GITHUB_REPO=your-username/mokgumeong-bbq

# VM 초기 설정 실행
bash scripts/deploy-vm.sh
```

**확인 사항:**
- Docker 설치 완료: `_______`
- Docker Compose 설치 완료: `_______`
- Watchtower 설치 완료: `_______`
- docker-compose.prod.yml 복사 완료: `_______`

### 5단계: .env 파일 생성 (VM에서)

```bash
# VM에 SSH 접속
ssh azureuser@<VM_IP>

# 애플리케이션 디렉토리로 이동
cd /opt/mokgumeong-bbq

# .env 파일 생성
cat > .env << 'EOF'
# GitHub Repository (필수! 실제 저장소 경로로 변경)
GITHUB_REPOSITORY=your-username/mokgumeong-bbq

# Hyperflow Configuration (필수)
HYPERFLOW_API_KEY=your_actual_api_key_here
HYPERFLOW_FLOWGRAPH_ID=your_actual_flowgraph_id_here
NEXT_PUBLIC_HYPERFLOW_FLOWGRAPH_ID=your_actual_flowgraph_id_here

# Firebase Configuration (선택사항 - 필요시만)
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

# .env 파일 수정
nano .env
```

**중요:** `GITHUB_REPOSITORY`를 실제 GitHub 저장소 경로로 변경해야 합니다!

예: `username/mokgumeong-bbq`

**확인 사항:**
- .env 파일 생성 완료: `_______`
- GITHUB_REPOSITORY 설정 완료: `_______`
- HYPERFLOW 환경 변수 설정 완료: `_______`

### 6단계: GitHub Container Registry 로그인 (VM에서)

```bash
# VM에서 실행
docker login ghcr.io

# Username: GitHub 사용자명
# Password: GitHub Personal Access Token
#   - Settings → Developer settings → Personal access tokens → Tokens (classic)
#   - Generate new token (classic)
#   - 권한: read:packages, write:packages
```

**확인 사항:**
- GitHub Personal Access Token 생성 완료: `_______`
- Docker 로그인 성공: `_______`

### 7단계: 애플리케이션 시작 (VM에서)

```bash
# VM에서 실행
cd /opt/mokgumeong-bbq

# 최신 이미지 다운로드 (처음 한 번만)
docker-compose -f docker-compose.prod.yml pull

# 애플리케이션 시작
docker-compose -f docker-compose.prod.yml up -d

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

**확인 사항:**
- 컨테이너 시작 완료: `_______`
- http://<VM_IP>:3000 접속 가능: `_______`

### 8단계: 자동 배포 테스트

```bash
# 로컬에서 실행
# 간단한 변경사항 만들기
echo "# Test auto deploy" >> README.md

# 커밋 및 푸시
git add .
git commit -m "Test auto deploy"
git push origin main
```

**확인 사항:**
1. GitHub Actions 탭에서 워크플로우 실행 확인
2. 빌드 완료 후 VM에서 자동 업데이트 확인
3. 애플리케이션이 정상 작동하는지 확인

---

## 🔍 문제 해결

### SSH 접속이 안 될 때
```bash
# 방화벽 확인
# Azure Portal → VM → Networking → 인바운드 규칙에 포트 22 추가
```

### Docker 이미지 다운로드 실패
```bash
# GitHub Container Registry 접근 권한 확인
# Settings → Packages → Package name → Manage access
```

### 컨테이너가 시작되지 않을 때
```bash
# 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 환경 변수 확인
docker-compose -f docker-compose.prod.yml config
```

---

## ✅ 완료 체크리스트

- [ ] 모든 단계 완료
- [ ] 애플리케이션 정상 작동 확인
- [ ] 자동 배포 테스트 성공
- [ ] http://<VM_IP>:3000 접속 가능

---

## 📞 다음 단계

이제 로컬에서 코드를 수정하고 `git push`하면 자동으로 배포됩니다!

```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions가 자동으로 빌드하고 VM에 배포합니다. 🎉

