# ServerSync — Migration & Rollback Guide

## Database Migrations

ServerSync uses plain SQL migration files. No ORM — intentional,
for transparency and portability.

### Running a migration
```bash
# Connect to the running MySQL container
docker exec -it serversync_mysql mysql -u root -p serversync

# Run migration file
SOURCE /migrations/001_add_response_time.sql;
```

### Migration file naming convention
```
migrations/
├── 001_initial_schema.sql       # baseline — matches init.sql
├── 002_add_response_time.sql    # example future migration
└── 003_add_tags_to_servers.sql
```

### Example migration file
```sql
-- migrations/002_add_response_time.sql
-- Adds response_time_ms column to metrics table
-- Safe to run multiple times (uses IF NOT EXISTS pattern)

ALTER TABLE metrics
ADD COLUMN IF NOT EXISTS response_time_ms INT DEFAULT NULL;
```

## Rollback Plan

### Code rollback (bad deployment)
```bash
# 1. Identify the last stable commit
git log --oneline -10

# 2. Roll back app container to previous image
docker-compose down
git checkout <last-stable-commit>
docker-compose up -d --build

# 3. Verify
curl -k https://localhost/health
```

### Database rollback (bad migration)
```bash
# 1. Stop the app to prevent writes
docker-compose stop app

# 2. Restore from latest backup
./scripts/restore.sh backups/<latest_backup>.sql.gz

# 3. Verify data integrity
docker exec -it serversync_mysql mysql -u root -p serversync
> SELECT COUNT(*) FROM metrics;
> SELECT COUNT(*) FROM servers;

# 4. Restart app on previous code
docker-compose start app
```

### Full environment rollback
```bash
# Nuclear option — wipe and restore everything
docker-compose down -v          # removes containers AND volumes
docker-compose up -d --build    # fresh start
./scripts/restore.sh backups/<backup>.sql.gz   # restore data
```

## Zero-Downtime Deployment (future improvement)
Current setup has ~5s downtime during `docker-compose restart`.
Next step: add a second app container and use Nginx upstream
load balancing to drain connections before restarting.