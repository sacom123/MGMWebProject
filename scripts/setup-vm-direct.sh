#!/bin/bash

# Direct VM Setup Script (run this ON the VM)
# For development with hot reload

set -e

echo "🚀 Setting up development environment on VM..."

APP_DIR="/opt/mokgumeong-bbq"

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create app directory
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

echo "✅ Setup complete!"
echo "📝 Next steps:"
echo "1. Copy your code to $APP_DIR"
echo "2. Create .env file with your environment variables"
echo "3. Run: cd $APP_DIR && docker-compose -f docker-compose.dev.yml up -d"

