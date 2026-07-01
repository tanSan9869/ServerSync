# ServerSync — Deployment Guide

## Prerequisites
- Docker >= 24.0
- Docker Compose >= 2.0
- A Linux server (Ubuntu 22.04 recommended)
- A domain name pointing to your server IP (optional for local dev)

## Environment Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/serversync.git
cd serversync
```

2. Copy and configure environment variables
```bash
cp .env.example .env
nano .env   # fill in your values
```

3. Generate SSL certificate
```bash
# Self-signed (local dev)
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/CN=localhost"

# Production (Let's Encrypt)
docker-compose run certbot
```

4. Start all services
```bash
docker-compose up -d --build
```

5. Verify deployment
```bash
curl -k https://localhost/health
# Expected: { "status": "ok", "timestamp": "..." }
```

## Environment-Specific Checklist

### Local Development
- [ ] `.env` has `DB_HOST=mysql`
- [ ] Docker Desktop running with >= 2GB RAM allocated
- [ ] Ports 80, 443, 3000, 3306 are free

### Staging
- [ ] `.env` values match staging DB credentials
- [ ] SSL cert generated for staging domain
- [ ] Backup cron job scheduled on host machine
- [ ] Smoke test all endpoints via Postman collection

### Production
- [ ] `.env` never committed to git
- [ ] Let's Encrypt cert (not self-signed)
- [ ] MySQL password is strong (not default)
- [ ] Backup cron running and verified
- [ ] `POLL_INTERVAL` tuned to expected server count
- [ ] Rate limiting confirmed active on `/api/` routes

## Scaling Considerations
- For > 50 servers: increase `POLL_INTERVAL` to avoid DB write congestion
- For high read load: add a read replica and point metrics queries there
- For alert delivery: add a webhook service (Slack/PagerDuty) in `alertService.js`
- For metric retention: add a cron job to purge `metrics` rows older than 30 days