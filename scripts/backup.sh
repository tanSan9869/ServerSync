#!/bin/bash

# Config
CONTAINER="serversync_mysql"
DB_NAME="serversync"
DB_USER="root"
DB_PASS="serversync_pass"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=7

# Create backup dir if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "[backup] Starting backup at $TIMESTAMP"

# Dump and compress in one step
docker exec "$CONTAINER" \
  mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "[backup] Success: $BACKUP_FILE"
else
  echo "[backup] FAILED" >&2
  exit 1
fi

# Delete backups older than RETENTION_DAYS
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[backup] Cleaned up backups older than $RETENTION_DAYS days"