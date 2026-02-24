# 🚀 Go-Live Checklist: Fase 2 Installments

**Status:** Ready for Production  
**Estimated Deployment Time:** 10 minutes  
**Risk Level:** Low (data-safe, non-breaking)

---

## Pre-Deployment Verification (5 minutes)

### ✓ Code Changes
- [ ] All 11 new files exist (run verification script)
  ```bash
  chmod +x verify-installments-integration.sh
  ./verify-installments-integration.sh
  ```

- [ ] AppModule imports InstallmentsModule
  ```bash
  grep -n "InstallmentsModule" src/app.module.ts
  # Should show 2 lines (import + imports array)
  ```

- [ ] EventsModule has both listeners
  ```bash
  grep -n "CreateInstallmentsListener\|UpdateInstallmentFromPaymentListener" \
    src/shared/events/events.module.ts
  # Should show 4 lines each (import + providers + exports)
  ```

### ✓ Build Check
- [ ] No TypeScript errors
  ```bash
  npm run build
  # Should complete without errors
  ```

- [ ] Compiled files exist
  ```bash
  ls dist/modules/installments/
  # Should show application/, infrastructure/, presentation/, installments.module.js
  ```

### ✓ Database Ready
- [ ] PostgreSQL running and accessible
  ```bash
  psql -U postgres -d flow_store -c "SELECT version();"
  # Should show PostgreSQL version
  ```

- [ ] Migration file exists
  ```bash
  ls src/migrations/1708595200000-CreateInstallmentsTable.ts
  # Should exist
  ```

- [ ] No existing "installments" table (if running migra twice)
  ```bash
  psql -U postgres -d flow_store -c "SELECT COUNT(*) FROM installments;" 2>&1
  # Should show "does not exist" or "0"
  ```

---

## Phase 1: Database Migration (2 minutes)

### Step 1: Create Backup (Safety First ⚠️)
```bash
pg_dump -U postgres flow_store > flow_store_backup_$(date +%Y%m%d_%H%M%S).sql
echo "✓ Backup created"
```

### Step 2: Run Migration
```bash
cd /backend
npm run typeorm -- migration:run
```

**Expected output:**
```
query: select version from "typeormmetadata"
migration 1708595200000-CreateInstallmentsTable has been executed successfully
```

### Step 3: Verify Table Creation
```bash
psql -U postgres -d flow_store -c "SELECT COUNT(*) FROM installments;"
# Should show: 0 (empty table, which is correct)
```

### Step 4: Verify Schema

```bash
psql -U postgres -d flow_store -c "\d installments;"
```

Expected output:
```
                      Table "public.installments"
        Column        |            Type             | Collation | Nullable | Default
─────────────────────┼─────────────────────────────┼───────────┼──────────┼─────────
 id                  | uuid                        |           | not null |
 saleTransactionId   | uuid                        |           | not null |
 installmentNumber   | integer                     |           | not null |
 totalInstallments   | integer                     |           | not null |
 amount              | numeric(15,2)               |           | not null |
 amountPaid          | numeric(15,2)               |           | not null | 0
 status              | character varying(20)       |           | not null | 'PENDING'
 dueDate             | timestamp without time zone |           | not null |
 paymentTransactionId| uuid                        |           |          |
 createdAt           | timestamp without time zone |           | not null | now()
 updatedAt           | timestamp without time zone |           | not null | now()
Indexes:
    "installments_pkey" PRIMARY KEY, btree (id)
    "IDX_installments_sale_transaction_and_number" UNIQUE, btree (saleTransactionId, installmentNumber)
    "IDX_installments_due_date" btree (dueDate)
    "IDX_installments_status" btree (status)
Foreign-key constraints:
    "FK_installments_saleTransactionId" FOREIGN KEY (saleTransactionId) REFERENCES transactions(id)
    "FK_installments_paymentTransactionId" FOREIGN KEY (paymentTransactionId) REFERENCES transactions(id)
```

✓ Migration successful!

---

## Phase 2: Application Restart (2 minutes)

### Step 1: Stop Current App
```bash
# If using npm run start:dev
# Press Ctrl+C in the terminal

# If running as service/PM2
pm2 stop flow-store-backend
# or
systemctl stop flow-store-backend
```

### Step 2: Clear Build Cache (Optional but Safe)
```bash
cd /backend
npm run clean 2>/dev/null || rm -rf dist/
npm run build
```

### Step 3: Start App
```bash
npm run start:dev
# or if using PM2:
pm2 start flow-store-backend
```

### Step 4: Verify App Started
```bash
# Check if listening
lsof -i :3000
# or curl
curl http://localhost:3000/health
# Should return 200 OK
```

### Step 5: Check Listener Registration
Look for logs in app output:
```
[InstallmentsModule] loaded ✓
[CreateInstallmentsListener] registered ✓
[UpdateInstallmentFromPaymentListener] registered ✓
EventEmitter ready for transaction.created events ✓
```

---

## Phase 3: Functional Testing (3 minutes)

### Test 1: Create Single-Payment Transaction (Baseline)
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionType": "SALE",
    "customerId": "CUSTOMER_ID_HERE",
    "total": 1000,
    "description": "Single payment test"
  }'

# Response should have: id, transactionType, total
# No installments should be created (numberOfInstallments not set)
```

**Verify no installments created:**
```bash
curl http://localhost:3000/installments/transaction/TRANSACTION_ID_FROM_ABOVE
# Should return: []
```

✓ Single-payment transactions unaffected

---

### Test 2: Create 3-Installment Transaction (Main Feature)
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionType": "PURCHASE",
    "supplierId": "SUPPLIER_ID_HERE",
    "total": 3000,
    "description": "Test 3-installment purchase",
    "numberOfInstallments": 3,
    "firstDueDate": "2026-03-01T00:00:00.000Z"
  }'

# Save the returned transaction ID
TRANSACTION_ID="..."
```

**Verify installments auto-created:**
```bash
curl http://localhost:3000/installments/transaction/$TRANSACTION_ID
```

Expected response:
```json
[
  {
    "id": "uuid-1",
    "saleTransactionId": "TRANSACTION_ID",
    "installmentNumber": 1,
    "totalInstallments": 3,
    "amount": "1000.00",
    "amountPaid": "0.00",
    "status": "PENDING",
    "dueDate": "2026-03-01T00:00:00Z",
    "paymentTransactionId": null
  },
  {
    "id": "uuid-2",
    "installmentNumber": 2,
    "amount": "1000.00",
    "dueDate": "2026-04-01T00:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "uuid-3",
    "installmentNumber": 3,
    "amount": "1000.00",
    "dueDate": "2026-05-01T00:00:00Z",
    "status": "PENDING"
  }
]
```

✓ Installments auto-created successfully

---

### Test 3: Database Verification
```bash
psql -U postgres -d flow_store -c "
  SELECT installmentNumber, status, dueDate 
  FROM installments 
  ORDER BY installmentNumber;
"

# Should show:
# installmentnumber | status  |     duedate
# ─────────────────┼─────────┼──────────────────
#         1        | PENDING | 2026-03-01 00:00:00
#         2        | PENDING | 2026-04-01 00:00:00
#         3        | PENDING | 2026-05-01 00:00:00
```

✓ Data persisted correctly

---

### Test 4: Payment Processing
```bash
# Create SUPPLIER_PAYMENT against first installment
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionType": "SUPPLIER_PAYMENT",
    "supplierId": "SUPPLIER_ID_HERE",
    "total": 1000,
    "relatedTransactionId": "TRANSACTION_ID_FROM_TEST2"
  }'

# Save this payment transaction ID
PAYMENT_ID="..."
```

**Verify installment updated:**
```bash
curl http://localhost:3000/installments/transaction/$TRANSACTION_ID
```

Expected change in first installment:
```json
{
  "id": "uuid-1",
  "installmentNumber": 1,
  "amount": "1000.00",
  "amountPaid": "1000.00",      // ← Changed from 0
  "status": "PAID",              // ← Changed from PENDING
  "paymentTransactionId": "..."  // ← Now linked
}
```

✓ Payment processed successfully

---

### Test 5: Cartera Query
```bash
curl "http://localhost:3000/installments/cartera/SUPPLIER_ID_HERE"
```

Expected response:
```json
{
  "supplierId": "SUPPLIER_ID",
  "totalOutstanding": 2000,    // 1000 + 1000 (2nd + 3rd cuota)
  "totalPaid": 1000,
  "totalOverdue": 0,
  "installmentsByStatus": {
    "PENDING": 2,
    "PARTIAL": 0,
    "PAID": 1,
    "OVERDUE": 0
  }
}
```

✓ Cartera query working

---

### Test 6: Overdue Report
```bash
curl http://localhost:3000/installments/reports/overdue
```

Expected response (should be empty if all due dates are in future):
```json
{
  "totalOverdue": 0,
  "overdueInstallments": []
}
```

✓ Overdue report working

---

### Test 7: Date Range Query
```bash
curl "http://localhost:3000/installments/reports/cartera-by-date?fromDate=2026-02-01&toDate=2026-05-31"
```

Expected response:
```json
[
  {
    "dueDate": "2026-03-01",
    "pendingAmount": "1000.00",
    "overdueAmount": "0.00",
    "installmentCount": 1
  },
  {
    "dueDate": "2026-04-01",
    "pendingAmount": "1000.00",
    "overdueAmount": "0.00",
    "installmentCount": 1
  }
]
```

✓ Date range query working

---

## Post-Deployment Checks (2 minutes)

### ✓ Performance Monitoring
```bash
# Monitor query times
curl -w "\nTime: %{time_total}s\n" \
  http://localhost:3000/installments/transaction/$TRANSACTION_ID

# Should be < 100ms (typically < 10ms)
```

### ✓ Error Handling
Test with invalid inputs:
```bash
# Query non-existent transaction
curl http://localhost:3000/installments/transaction/00000000-0000-0000-0000-000000000000
# Should return: [] (empty array)

# Query non-existent cartera
curl http://localhost:3000/installments/cartera/00000000-0000-0000-0000-000000000000
# Should return 404 or empty summary
```

### ✓ Log Monitoring
```bash
# Check for errors in last 50 lines of logs
tail -50 logs/app.log | grep -i error
# Should show nothing (or only expected errors, if any)
```

### ✓ Database Integrity
```bash
psql -U postgres -d flow_store -c "
  SELECT 
    COUNT(*) as installment_count,
    SUM(amount) as total_amount,
    COUNT(DISTINCT saleTransactionId) as distinct_transactions
  FROM installments;
"
```

Should show expected numbers matching your tests.

---

## Rollback Plan (If Needed ⚠️)

### Quick Rollback (< 5 minutes)

If critical issues occur:

```bash
# 1. Stop app
Ctrl+C  # or pm2 stop

# 2. Revert migration
npm run typeorm -- migration:revert

# 3. Clean up any data (if needed)
# psql -U postgres -d flow_store -c "DELETE FROM installments;"

# 4. Restart app (without Installments)
npm run start:dev
```

### Full Rollback (with git)

```bash
# If code changes caused issues:
cd /backend
git revert HEAD  # Or checkout previous version
npm install
npm run build
npm run typeorm -- migration:revert
npm run start:dev
```

### Restore from Backup

```bash
# If data corruption occurred:
psql -U postgres < flow_store_backup_YYYYMMDD_HHMMSS.sql
npm run typeorm -- migration:run
npm run start:dev
```

---

## Success Criteria

✅ All tests pass  
✅ No errors in logs  
✅ Response times < 100ms  
✅ All 3 installments created automatically  
✅ Payment processing links installments  
✅ Cartera queries return expected results  
✅ Database integrity verified  

---

## Sign-Off

| Item | Status | Verified By | Date |
|------|--------|-------------|------|
| Migration Executed | ✓ | | |
| App Restarted | ✓ | | |
| Single-Payment Test | ✓ | | |
| 3-Installment Test | ✓ | | |
| Payment Processing | ✓ | | |
| Cartera Query | ✓ | | |
| Performance OK | ✓ | | |
| No Errors in Logs | ✓ | | |
| **PRODUCTION READY** | **✓** | | |

---

## Support Contacts

- **Technical Issues:** Check INSTALLMENTS_INTEGRATION.md
- **Database Problems:** See Database Backup section above
- **Architecture Questions:** See FASE2_ARCHITECTURE_DIAGRAMS.md
- **Testing Guide:** Run verify-installments-integration.sh

---

**Deployment Date:** ________________  
**Deployed By:** ________________  
**Verified By:** ________________  

**Status: ✅ READY FOR PRODUCTION**

---

*Save this checklist and review before going live.*
*Time estimate: 10 minutes total*
*Risk level: LOW (data-safe, backups available)*
