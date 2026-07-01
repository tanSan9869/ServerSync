# ServerSync

Infrastructure monitoring and deployment toolkit built with Node.js, 
Express, MySQL, and Docker.

## What it does
- Polls registered servers every 30s for CPU, memory, disk, and uptime metrics
- Fires alerts when thresholds are breached (configurable via env vars)
- Aggregates logs across all servers into a single queryable API
- Runs behind Nginx with SSL termination and HTTP→HTTPS redirect
- Automated daily backups with 7-day retention and one-command restore

## Stack
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js |
| Database | MySQL 8.0 |
| Scheduler | node-cron |
| Proxy | Nginx (SSL termination) |
| Containers | Docker + Docker Compose |

## Quick start
```bash
git clone https://github.com/yourusername/serversync.git
cd serversync
cp .env.example .env
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -subj "/CN=localhost"
docker-compose up --build
```

Visit `https://localhost/docs` for the full API reference.

## Configuration
All thresholds and intervals are configurable via `.env`:
```
POLL_INTERVAL=30          # seconds between health checks
ALERT_CPU_THRESHOLD=85    # % CPU to trigger alert
ALERT_MEMORY_THRESHOLD=90 # % memory to trigger alert
ALERT_DISK_THRESHOLD=80   # % disk to trigger alert
```

## Backup & restore
```bash
./scripts/backup.sh                          # manual backup
./scripts/restore.sh backups/<file>.sql.gz   # restore
```

See `docs/deployment.md` and `docs/migration.md` for full 
deployment and rollback procedures.
=======
ServerSync is a Dockerized server monitoring and alerting service built with Node.js, Express, MySQL, and Nginx. It tracks servers, collects health and metrics data, stores alerts and logs, and runs a scheduler that periodically checks each monitored server.

## What it does

- Exposes a REST API for managing servers, metrics, alerts, and logs.
- Uses a background scheduler to ping servers and record health data.
- Stores data in MySQL.
- Fronts the API with Nginx for reverse proxying and HTTPS.
- Includes backup and restore scripts for the MySQL database.

## Project structure

```text
src/
  config/
  controllers/
  jobs/
  middleware/
  routes/
  services/
nginx/
scripts/
backups/
```

## Requirements

- Docker and Docker Compose
- Bash if you want to use the backup and restore scripts directly
- Node.js 22+ only if you want to run the app outside Docker

## Configuration

The app reads its settings from `.env`.

Common variables:

```env
PORT=3000
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASS=serversync_pass
DB_NAME=serversync
POLL_INTERVAL=30
ALERT_CPU_THRESHOLD=85
ALERT_MEMORY_THRESHOLD=90
ALERT_DISK_THRESHOLD=80
ALERT_TIMEOUT_MS=10000
```

If you are using the Docker stack, the MySQL container uses the password `serversync_pass` by default.

## Run with Docker

1. Make sure Docker is running.
2. Start the stack:

```bash
docker-compose up --build
```

3. Open the API through Nginx:
- HTTP: `http://localhost:8080`
- HTTPS: `https://localhost:8443` if you have valid certificates in `nginx/ssl`

The app container listens on port `3000`, MySQL on `3307`, and Nginx proxies requests to the app.

## HTTPS and Nginx

Nginx is configured as the reverse proxy for the app and expects certificate files at:

- `nginx/ssl/cert.pem`
- `nginx/ssl/key.pem`

If those files are missing, HTTPS will not start correctly. The `nginx` configuration also includes an ACME challenge path under `/.well-known/acme-challenge/` for certificate issuance workflows.

## API endpoints

### Health

- `GET /health` - basic service health check

### Servers

- `GET /api/servers` - list servers
- `POST /api/servers` - create a server
- `GET /api/servers/:id` - get a server by ID
- `DELETE /api/servers/:id` - delete a server
- `GET /api/servers/:id/ping` - ping a server immediately
- `GET /api/servers/:id/metrics` - list metrics for a server
- `GET /api/servers/:id/alerts` - list alerts for a server
- `PUT /api/servers/:id/alerts/:alertId/resolve` - mark an alert as resolved

### Logs

- `GET /api/logs` - fetch aggregated logs

Supported log filters:

- `serverId`
- `type`
- `resolved=true|false`

Example:

```bash
curl "http://localhost:8080/api/logs?serverId=1&type=down&resolved=false"
```

## Backup and restore

The repository includes scripts for database backup and restore.

### Backup

```bash
bash scripts/backup.sh
```

This creates a compressed SQL dump in `backups/` and removes backups older than 7 days.

### Restore

```bash
bash scripts/restore.sh backups/serversync_YYYYMMDD_HHMMSS.sql.gz
```

Replace the path with the backup file you want to restore.

## Development notes

- The scheduler runs automatically when the app starts.
- Metrics and alert queries depend on the MySQL schema in `src/config/init.sql`.
- The app uses `morgan` for request logging and centralized error handling in `src/middleware/errorHandler.js`.

## Troubleshooting

- If Nginx returns `502`, verify the app container is running and listening on port `3000`.
- If database calls fail, confirm the MySQL container is healthy and the values in `.env` match the Compose configuration.
- If HTTPS fails to start, make sure the certificate files exist in `nginx/ssl/`.

## License

No license has been declared in this repository yet.

