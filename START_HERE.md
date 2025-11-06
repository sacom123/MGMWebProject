# 🚀 지금 바로 시작하기

## 📋 제공된 정보
- VM IP: `20.196.139.120`
- GitHub 저장소: `sacom123/MGMWebPage`

## ✅ 1단계: SSH 키 확인 및 VM 접속 테스트

```bash
# SSH 키가 있는지 확인
ls -la ~/.ssh/id_rsa

# SSH 키가 없다면 생성
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy"
# 저장 위치: 엔터 (기본 위치)
# 비밀번호: 엔터 (또는 설정)

# 공개 키를 VM에 복사
ssh-copy-id azureuser@20.196.139.120
# 또는
ssh-copy-id ubuntu@20.196.139.120

# 접속 테스트
ssh azureuser@20.196.139.120
# 또는
ssh ubuntu@20.196.139.120
```

**어떤 사용자명으로 접속되는지 확인해주세요!** (azureuser 또는 ubuntu)

## ✅ 2단계: GitHub Secrets 설정

GitHub 저장소: https://github.com/sacom123/MGMWebPage

1. 저장소로 이동 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Secret 1: VM_SSH_KEY
```bash
# 로컬에서 실행하여 개인 키 복사
cat ~/.ssh/id_rsa
```
- Name: `VM_SSH_KEY`
- Value: 전체 내용 복사 (-----BEGIN 부터 -----END 까지)

### Secret 2: VM_USER
- Name: `VM_USER`
- Value: `azureuser` 또는 `ubuntu` (위에서 확인한 사용자명)

### Secret 3: VM_IP
- Name: `VM_IP`
- Value: `20.196.139.120`

## ✅ 3단계: VM 초기 설정

```bash
# 로컬에서 실행
export VM_USER=azureuser  # 또는 ubuntu
export VM_IP=20.196.139.120
export GITHUB_REPO=sacom123/MGMWebPage

# VM 초기 설정 실행
bash scripts/deploy-vm.sh
```

## ✅ 4단계: .env 파일 생성 (VM에서)

```bash
# VM에 SSH 접속
ssh azureuser@20.196.139.120  # 또는 ubuntu@20.196.139.120

# 디렉토리로 이동
cd /opt/mokgumeong-bbq

# .env 파일 생성
cat > .env << 'EOF'
GITHUB_REPOSITORY=sacom123/MGMWebPage

# Hyperflow Configuration (필수)
HYPERFLOW_API_KEY=your_hyperflow_api_key_here
HYPERFLOW_FLOWGRAPH_ID=your_flowgraph_id_here
NEXT_PUBLIC_HYPERFLOW_FLOWGRAPH_ID=your_flowgraph_id_here

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

# 실제 값으로 수정
nano .env
```

## ✅ 5단계: GitHub Container Registry 로그인 (VM에서)

```bash
# VM에서 실행
docker login ghcr.io
# Username: sacom123
# Password: GitHub Personal Access Token
#   - https://github.com/settings/tokens
#   - Generate new token (classic)
#   - 권한: read:packages, write:packages
```

## ✅ 6단계: 애플리케이션 시작 (VM에서)

```bash
cd /opt/mokgumeong-bbq
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml logs -f
```

## ✅ 7단계: 테스트

브라우저에서 접속: http://20.196.139.120:3000

## ✅ 8단계: 자동 배포 테스트

```bash
# 로컬에서
git add .
git commit -m "Test auto deploy"
git push origin main
```

GitHub Actions가 자동으로 빌드하고 배포합니다!

