#!/bin/bash

# VM 초기 설정 스크립트 (VM에서 직접 실행)
# 이 스크립트는 VM에서 서버 실행 환경만 구성합니다.

set -e

echo "🚀 Azure VM 서버 실행 환경 설정 중..."

APP_DIR="/opt/mokgumeong-bbq"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Docker 설치
echo -e "${BLUE}Step 1: Docker 설치 확인...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Docker 설치 중..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker 설치 완료${NC}"
    echo -e "${YELLOW}⚠️  로그아웃 후 다시 로그인하거나 'newgrp docker'를 실행하세요.${NC}"
else
    echo -e "${GREEN}✅ Docker가 이미 설치되어 있습니다.${NC}"
fi

# Step 2: Docker Compose 설치
echo -e "${BLUE}Step 2: Docker Compose 설치 확인...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose 설치 중..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose 설치 완료${NC}"
else
    echo -e "${GREEN}✅ Docker Compose가 이미 설치되어 있습니다.${NC}"
fi

# Step 3: 애플리케이션 디렉토리 생성
echo -e "${BLUE}Step 3: 애플리케이션 디렉토리 생성...${NC}"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
echo -e "${GREEN}✅ 디렉토리 생성 완료: $APP_DIR${NC}"

# Step 4: Watchtower 설치 (자동 업데이트)
echo -e "${BLUE}Step 4: Watchtower 설치 (자동 업데이트)...${NC}"
if ! docker ps -a | grep -q watchtower; then
    docker run -d \
        --name watchtower \
        --restart unless-stopped \
        -v /var/run/docker.sock:/var/run/docker.sock \
        containrrr/watchtower \
        --cleanup \
        --interval 30 \
        mokgumeong-web
    echo -e "${GREEN}✅ Watchtower 설치 완료${NC}"
    echo -e "${BLUE}   Watchtower는 30초마다 새 이미지를 확인하고 자동 업데이트합니다.${NC}"
else
    echo -e "${GREEN}✅ Watchtower가 이미 실행 중입니다.${NC}"
fi

echo -e "${GREEN}✅ VM 초기 설정 완료!${NC}"
echo -e ""
echo -e "${BLUE}📝 다음 단계:${NC}"
echo -e "   1. cd $APP_DIR"
echo -e "   2. docker-compose.prod.yml 파일을 이 디렉토리에 복사"
echo -e "   3. .env 파일 생성 (필수 환경 변수 설정)"
echo -e "   4. docker-compose -f docker-compose.prod.yml up -d"
echo -e ""
echo -e "${BLUE}💡 GitHub Actions가 자동으로 배포하면 Watchtower가 감지하여 업데이트합니다.${NC}"

