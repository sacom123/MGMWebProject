#!/bin/bash

# Azure VM Deployment Script
# This script sets up the application on Azure VM with auto-update capability

set -e

echo "🚀 Setting up Azure VM for 목구멍 Website..."

# Configuration
VM_USER="${VM_USER:-azureuser}"
VM_IP="${VM_IP}"
APP_DIR="/opt/mokgumeong-bbq"
GITHUB_REPO="${GITHUB_REPO:-your-username/mokgumeong-bbq}"
GITHUB_TOKEN="${GITHUB_TOKEN}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "$VM_IP" ]; then
    echo -e "${RED}❌ VM_IP environment variable is required${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Installing Docker on VM...${NC}"
ssh $VM_USER@$VM_IP << 'EOF'
    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
    fi

    # Install Docker Compose if not present
    if ! command -v docker-compose &> /dev/null; then
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi

    # Install Watchtower for auto-updates
    docker run -d \
        --name watchtower \
        --restart unless-stopped \
        -v /var/run/docker.sock:/var/run/docker.sock \
        containrrr/watchtower \
        --cleanup \
        --interval 30 \
        mokgumeong-web
EOF

echo -e "${BLUE}Step 2: Creating application directory...${NC}"
ssh $VM_USER@$VM_IP << EOF
    sudo mkdir -p $APP_DIR
    sudo chown $VM_USER:$VM_USER $APP_DIR
    cd $APP_DIR
EOF

echo -e "${BLUE}Step 3: Copying docker-compose.prod.yml to VM...${NC}"
scp docker-compose.prod.yml $VM_USER@$VM_IP:$APP_DIR/

echo -e "${BLUE}Step 4: Creating .env template on VM...${NC}"
ssh $VM_USER@$VM_IP << EOF
    cd $APP_DIR
    cat > .env.template << 'EOL'
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
EOL
    echo -e "${GREEN}✅ .env.template 파일이 생성되었습니다.${NC}"
    echo -e "${BLUE}📝 .env 파일을 직접 생성해주세요:${NC}"
    echo -e "   cp .env.template .env"
    echo -e "   nano .env"
EOF

echo -e "${BLUE}Step 5: Setting up GitHub Container Registry login (선택사항)...${NC}"
if [ -n "$GITHUB_TOKEN" ]; then
    ssh $VM_USER@$VM_IP << EOF
        echo "$GITHUB_TOKEN" | docker login ghcr.io -u $(echo "$GITHUB_REPO" | cut -d'/' -f1) --password-stdin
EOF
    echo -e "${GREEN}✅ GitHub Container Registry 로그인 완료${NC}"
else
    echo -e "${BLUE}⚠️  GITHUB_TOKEN이 설정되지 않았습니다.${NC}"
    echo -e "${BLUE}   나중에 수동으로 로그인해야 합니다:${NC}"
    echo -e "   docker login ghcr.io"
fi

echo -e "${GREEN}✅ VM 초기 설정이 완료되었습니다!${NC}"
echo -e "${BLUE}📝 다음 단계:${NC}"
echo -e "   1. VM에 SSH 접속: ssh $VM_USER@$VM_IP"
echo -e "   2. .env 파일 생성: cd $APP_DIR && cp .env.template .env && nano .env"
echo -e "   3. 애플리케이션 시작: docker-compose -f docker-compose.prod.yml up -d"
echo -e ""
echo -e "${BLUE}📝 GitHub Actions가 자동으로 배포하면 Watchtower가 30초마다 새 이미지를 확인합니다.${NC}"

