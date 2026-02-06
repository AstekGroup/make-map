#!/bin/bash

# Deploy script for Scaleway Object Storage
# Usage: pnpm deploy:scw

set -e

# Configuration
BUCKET_NAME="mockup-map-ai-week"
ENDPOINT_URL="https://s3.fr-par.scw.cloud"
DIST_DIR="apps/map-interactive/dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Déploiement sur Scaleway Object Storage${NC}"
echo ""

# Check if aws cli is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Erreur: AWS CLI n'est pas installé${NC}"
    echo "Installez-le avec: brew install awscli"
    exit 1
fi

# Load secrets from envmap (strip control characters)
if command -v envmap &> /dev/null && [ -f ".envmap.yaml" ]; then
    echo -e "${YELLOW}🔐 Chargement des secrets via envmap...${NC}"
    SCW_ACCESS_KEY=$(envmap get --env prod SCW_ACCESS_KEY --raw | tr -d '\001')
    SCW_SECRET_KEY=$(envmap get --env prod SCW_SECRET_KEY --raw | tr -d '\001')
    SCW_PROJECT_ID=$(envmap get --env prod SCW_PROJECT_ID --raw | tr -d '\001')
fi

# Check for required environment variables
if [ -z "$SCW_ACCESS_KEY" ] || [ -z "$SCW_SECRET_KEY" ]; then
    echo -e "${RED}❌ Erreur: Les credentials Scaleway sont requis${NC}"
    echo "Configurez-les avec: envmap set --env prod SCW_ACCESS_KEY --prompt"
    exit 1
fi

# Build
echo -e "${YELLOW}📦 Build du projet...${NC}"
pnpm build

echo ""
echo -e "${YELLOW}☁️  Upload vers s3://${BUCKET_NAME}...${NC}"

# Sync to Scaleway
AWS_ACCESS_KEY_ID="$SCW_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY" \
AWS_DEFAULT_REGION="fr-par" \
aws s3 sync "$DIST_DIR" "s3://${BUCKET_NAME}" \
    --endpoint-url "$ENDPOINT_URL" \
    --delete

echo ""
echo -e "${GREEN}✅ Déploiement terminé!${NC}"
echo -e "   URL: https://${BUCKET_NAME}.s3-website.fr-par.scw.cloud"
