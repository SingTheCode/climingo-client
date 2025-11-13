#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Let's Encrypt SSL 인증서 발급 ===${NC}\n"

# 1. DNS 확인
echo -e "${YELLOW}[1/6] DNS 설정 확인${NC}"
echo "app.climingo.xyz:"
nslookup app.climingo.xyz | grep -E "Address:|Name:" | tail -2
echo ""
echo "dev-app.climingo.xyz:"
nslookup dev-app.climingo.xyz | grep -E "Address:|Name:" | tail -2
echo ""

read -p "DNS가 climingo.hopto.org를 가리키나요? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ DNS 설정 후 다시 실행하세요${NC}"
    exit 1
fi

# 2. 디렉토리 생성
echo -e "\n${YELLOW}[2/6] 디렉토리 생성${NC}"
mkdir -p nginx/webroot nginx/logs nginx/certbot-logs

# 3. 임시 HTTP 전용 설정 적용
echo -e "\n${YELLOW}[3/6] 임시 HTTP 설정 적용${NC}"
cat > nginx/conf.d/default.conf << 'EOF'
upstream app_backend {
    server climingo-client:3000;
}

upstream dev_backend {
    server climingo-client-dev:3000;
}

server {
    listen 80;
    server_name app.climingo.xyz;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://app_backend;
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name dev-app.climingo.xyz;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://dev_backend;
        proxy_set_header Host $host;
    }
}
EOF

# 4. 컨테이너 시작
echo -e "\n${YELLOW}[4/6] 컨테이너 시작${NC}"
docker-compose up -d nginx-proxy climingo-client climingo-client-dev
sleep 5

# 5. 인증서 발급
echo -e "\n${YELLOW}[5/6] Let's Encrypt 인증서 발급${NC}"

echo -e "${GREEN}▶ app.climingo.xyz${NC}"
docker-compose run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    --email spiderq10@gmail.com \
    --agree-tos \
    --no-eff-email \
    -d app.climingo.xyz

echo -e "\n${GREEN}▶ dev-app.climingo.xyz${NC}"
docker-compose run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    --email spiderq10@gmail.com \
    --agree-tos \
    --no-eff-email \
    -d dev-app.climingo.xyz

# 6. HTTPS 설정 적용
echo -e "\n${YELLOW}[6/6] HTTPS 설정 적용${NC}"
cp nginx/conf.d/default.conf.production nginx/conf.d/default.conf

# Certbot 자동 갱신 시작
docker-compose up -d certbot
docker-compose restart nginx-proxy

sleep 3

# 검증
echo -e "\n${YELLOW}설정 검증 중...${NC}"
if docker exec nginx-proxy nginx -t; then
    echo -e "\n${GREEN}✅ SSL 인증서 발급 완료!${NC}"
    echo -e "\n접속 URL:"
    echo -e "  ${GREEN}https://app.climingo.xyz${NC}"
    echo -e "  ${GREEN}https://dev-app.climingo.xyz${NC}"
    echo -e "\n${YELLOW}📌 인증서는 90일마다 자동 갱신됩니다${NC}"
else
    echo -e "\n${RED}❌ Nginx 설정 오류${NC}"
    docker-compose logs --tail=20 nginx-proxy
    exit 1
fi
