#!/usr/bin/env bash
set -euo pipefail
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=redbull90
DB_NAME="flow-store"
API_URL="${API_URL:-http://127.0.0.1:3010}"

echo "Looking up a supplier, storage and product variant from DB..."
SUPPLIER_ID=$(mysql -u $DB_USER -p$DB_PASS -h $DB_HOST -P $DB_PORT -N -s -e "SELECT id FROM persons WHERE id IN (SELECT personId FROM suppliers) LIMIT 1;" $DB_NAME || true)
if [ -z "$SUPPLIER_ID" ]; then
  # try suppliers table direct
  SUPPLIER_ID=$(mysql -u $DB_USER -p$DB_PASS -h $DB_HOST -P $DB_PORT -N -s -e "SELECT id FROM suppliers LIMIT 1;" $DB_NAME || true)
fi
STORAGE_ID=$(mysql -u $DB_USER -p$DB_PASS -h $DB_HOST -P $DB_PORT -N -s -e "SELECT id FROM storages LIMIT 1;" $DB_NAME || true)
VARIANT_ID=$(mysql -u $DB_USER -p$DB_PASS -h $DB_HOST -P $DB_PORT -N -s -e "SELECT id FROM product_variants LIMIT 1;" $DB_NAME || true)

echo "Supplier: $SUPPLIER_ID"
echo "Storage: $STORAGE_ID"
echo "Variant: $VARIANT_ID"

if [ -z "$SUPPLIER_ID" ] || [ -z "$STORAGE_ID" ] || [ -z "$VARIANT_ID" ]; then
  echo "Missing data in DB (supplier/storage/variant). Aborting test." >&2
  exit 2
fi

# Build payload
PAYLOAD=$(cat <<JSON
{
  "supplierId": "$SUPPLIER_ID",
  "storageId": "$STORAGE_ID",
  "receptionDate": "$(date +%F)",
  "lines": [
    {"productVariantId": "$VARIANT_ID", "receivedQuantity": 1, "unitPrice": 1000, "unitCost": 1000}
  ],
  "notes": "test reception script",
  "payments": [{"id":"p1","amount":1000,"dueDate":"$(date +%F)"}]
}
JSON
)

echo "Posting reception to $API_URL/api/receptions/direct"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/api/receptions/direct" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

echo "Response:"
echo "$RESPONSE"

echo "Checking transactions table for recent entries..."
mysql -u $DB_USER -p$DB_PASS -h $DB_HOST -P $DB_PORT -e "SELECT id, documentNumber, transactionType, total, createdAt FROM transactions ORDER BY createdAt DESC LIMIT 5;" $DB_NAME || true

exit 0
