#!/bin/bash

# Azure Deployment Script for 목구멍 Website
# This script builds and deploys the Docker container to Azure

set -e

echo "🚀 Starting Azure deployment for 목구멍 Website..."

# Configuration
RESOURCE_GROUP="mokgumeong-rg"
LOCATION="koreacentral"
ACR_NAME="mokgumeongacr"
IMAGE_NAME="mokgumeong-web"
CONTAINER_APP_NAME="mokgumeong-web"
CONTAINER_APP_ENV="mokgumeong-env"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Creating Resource Group...${NC}"
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

echo -e "${BLUE}Step 2: Creating Azure Container Registry...${NC}"
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

echo -e "${BLUE}Step 3: Building Docker image...${NC}"
docker build -t $IMAGE_NAME:latest .

echo -e "${BLUE}Step 4: Tagging image for ACR...${NC}"
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
docker tag $IMAGE_NAME:latest $ACR_LOGIN_SERVER/$IMAGE_NAME:latest

echo -e "${BLUE}Step 5: Logging into ACR...${NC}"
az acr login --name $ACR_NAME

echo -e "${BLUE}Step 6: Pushing image to ACR...${NC}"
docker push $ACR_LOGIN_SERVER/$IMAGE_NAME:latest

echo -e "${BLUE}Step 7: Creating Container App Environment...${NC}"
az containerapp env create \
  --name $CONTAINER_APP_ENV \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

echo -e "${BLUE}Step 8: Deploying Container App...${NC}"
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENV \
  --image $ACR_LOGIN_SERVER/$IMAGE_NAME:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Get the application URL
APP_URL=$(az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo -e "${GREEN}🌐 Your application is available at: https://$APP_URL${NC}"
