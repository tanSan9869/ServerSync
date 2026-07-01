#!/bin/bash

BACKUP_FILE=$1
CONTAINER="serversync_mysql"
DB_NAME="serversync"
DB_USER="root"
DB_PASS="serversync_pass"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore.sh <backup_file.sql.gz>"
  exit 1
fi

echo "[restore] Restoring from $BACKUP_FILE..."

gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER" \
  mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME"

if [ $? -eq 0 ]; then
  echo "[restore] Restore complete"
else
  echo "[restore] FAILED" >&2
  exit 1
fi