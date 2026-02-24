# Fase 2: Installments Integration - Status & Next Steps

**Date:** 22 de febrero de 2026  
**Status:** 95% Complete ✅  
**Migration Ready:** YES  

---

## ✅ Completed Components

### Data Layer
- [x] **Entity:** `Installment.entity.ts` - Full domain model with status enum and calculated methods
- [x] **Migration:** `1708595200000-CreateInstallmentsTable.ts` - Ready to execute
- [x] **Repository:** `installment.repository.ts` - 7 specialized query methods
- [x] **Index:** 3 indexes on (saleTransactionId+installmentNumber), (dueDate), (status)

### Application Layer
- [x] **Service:** `installment.service.ts` - 6 core business methods
- [x] **DTOs:** `create-installment.dto.ts`, `installment.dto.ts` - Full validation
- [x] **Controller:** `installment.controller.ts` - 6 REST endpoints

### Event-Driven Automation
- [x] **Listener #1:** `create-installments.listener.ts` - Auto-creates cuotas on SALE/PURCHASE
- [x] **Listener #2:** `update-installment-from-payment.listener.ts` - Applies payments to cuotas
- [x] **EventsModule:** Updated to register both listeners
- [x] **AppModule:** Imported InstallmentsModule

### Documentation
- [x] 6 markdown files explaining transaction types
- [x] API implementation summary
- [x] Integration checklist

---

## 🚀 Immediate Next Steps (Execute in Order)

### Step 1: Initialize Database
```bash
cd /backend
npm run typeorm -- migration:run
```

**What happens:**
- Creates `installments` table with 11 columns
- Creates 3 indexes for fast queries
- Creates 2 foreign key constraints

**Time:** ~5 seconds

---

### Step 2: Update Transaction Module Integration

#### 2a. Update TransactionController DTO
**File:** `/backend/src/modules/transactions/presentation/dto/create-transaction.dto.ts`

**Current:**
```typescript
@IsString()
@IsOptional()
description?: string;
```

**Add:**
```typescript
@IsNumber()
@IsPositive()
@IsOptional()
numberOfInstallments?: number = 1;

@IsISO8601()
@IsOptional()
firstDueDate?: string;
```

---

#### 2b. Update TransactionService
**File:** `/backend/src/modules/transactions/application/services/transaction.service.ts`

**Find method:** `createTransaction()` or `create()`

**Current flow:**
```typescript
const savedTransaction = await this.transactionRepository.save(transaction);
return savedTransaction;
```

**Update to:**
```typescript
const savedTransaction = await this.transactionRepository.save(transaction);

// Store installment metadata for listener to pick up
if (createTransactionDto.numberOfInstallments > 1) {
  savedTransaction.metadata = {
    numberOfInstallments: createTransactionDto.numberOfInstallments,
    firstDueDate: createTransactionDto.firstDueDate || new Date().toISOString(),
  };
}

return savedTransaction;
```

---

### Step 3: Testing - Create Purchase in 3 Installments

**Using cURL or Postman:**

```bash
POST http://localhost:3000/transactions
Content-Type: application/json

{
  "transactionType": "PURCHASE",
  "supplierId": "YOUR_SUPPLIER_UUID",
  "centroId": "YOUR_CENTRO_UUID",
  "total": 3000,
  "description": "Test 3-cuota purchase",
  "numberOfInstallments": 3,
  "firstDueDate": "2026-03-01T00:00:00.000Z"
}
```

**Expected result:**

1. Transaction created with `transactionType: "PURCHASE"`
2. Listener triggers automatically
3. 3 installments created in DB:
   - Cuota 1: 1000 due 2026-03-01
   - Cuota 2: 1000 due 2026-04-01
   - Cuota 3: 1000 due 2026-05-01

**Verify in DB:**
```sql
SELECT * FROM installments WHERE saleTransactionId = 'YOUR_TRANSACTION_ID';
```

---

### Step 4: Register Payment Against Installment

**Create SUPPLIER_PAYMENT transaction:**

```bash
POST http://localhost:3000/transactions
Content-Type: application/json

{
  "transactionType": "SUPPLIER_PAYMENT",
  "supplierId": "YOUR_SUPPLIER_UUID",
  "total": 1000,
  "relatedTransactionId": "YOUR_PURCHASE_TRANSACTION_ID"
}
```

**Expected result:**

1. Payment transaction created
2. Listener triggers
3. First installment updated:
   - amountPaid: 1000
   - status: "PAID"
   - paymentTransactionId: linked to payment

---

### Step 5: Query Installments via API

**Get installments for a transaction:**
```bash
GET http://localhost:3000/installments/transaction/{transactionId}
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "installmentNumber": 1,
    "totalInstallments": 3,
    "amount": 1000,
    "amountPaid": 1000,
    "status": "PAID",
    "dueDate": "2026-03-01",
    "paymentTransactionId": "payment-uuid"
  },
  {
    "id": "uuid-2",
    "installmentNumber": 2,
    "totalInstallments": 3,
    "amount": 1000,
    "amountPaid": 0,
    "status": "PENDING",
    "dueDate": "2026-04-01",
    "paymentTransactionId": null
  },
  {
    "id": "uuid-3",
    "installmentNumber": 3,
    "totalInstallments": 3,
    "amount": 1000,
    "amountPaid": 0,
    "status": "PENDING",
    "dueDate": "2026-05-01",
    "paymentTransactionId": null
  }
]
```

---

### Step 6: Check Cartera (Accounts Payable)

**Get cartera summary for supplier:**
```bash
GET http://localhost:3000/installments/cartera/{supplierId}
```

**Response:**
```json
{
  "supplierId": "supplier-uuid",
  "totalOutstanding": 2000,
  "totalOverdue": 0,
  "totalPending": 2000,
  "totalPartial": 0,
  "installmentsByStatus": {
    "PENDING": 2,
    "PARTIAL": 0,
    "PAID": 1,
    "OVERDUE": 0
  }
}
```

---

### Step 7: Check Overdue Installments

**Get morosidad report:**
```bash
GET http://localhost:3000/installments/reports/overdue
```

**Response:**
```json
{
  "totalOverdue": 15000,
  "overdueInstallments": [
    {
      "id": "uuid",
      "installmentNumber": 1,
      "amount": 5000,
      "dueDate": "2025-12-01",
      "daysOverdue": 53,
      "saleTransactionId": "tx-uuid"
    }
  ]
}
```

---

### Step 8: Check Cartera by Date Range

**Get due dates report:**
```bash
GET http://localhost:3000/installments/reports/cartera-by-date?fromDate=2026-03-01&toDate=2026-05-31
```

**Response:**
```json
[
  {
    "dueDate": "2026-03-01",
    "pendingAmount": 5000,
    "overdueAmount": 0,
    "installmentCount": 2
  },
  {
    "dueDate": "2026-04-01",
    "pendingAmount": 3000,
    "overdueAmount": 0,
    "installmentCount": 1
  }
]
```

---

## 📊 Architecture Summary

### How It Works

1. **Transaction Created** (SALE/PURCHASE with numberOfInstallments=3)
   ↓
2. **CreateInstallmentsListener Triggered** (via @OnEvent)
   ↓
3. **3 Installments Created** in DB (with calculated dueDate intervals)
   ↓
4. **Payment Registered** (SUPPLIER_PAYMENT with relatedTransactionId)
   ↓
5. **UpdateInstallmentFromPaymentListener Triggered**
   ↓
6. **First Installment Updated** (amountPaid += paymentAmount, status checked)
   ↓
7. **Queries Available** (cartera, overdue, by-date via Controller)

### Table Structure

```
installments {
  id: UUID (PK)
  saleTransactionId: UUID (FK -> transactions.id, indexed)
  installmentNumber: integer (1-based)
  totalInstallments: integer (total count)
  amount: decimal(15,2) (original cuota amount)
  amountPaid: decimal(15,2) (cumulative payments)
  status: enum(PENDING|PARTIAL|PAID|OVERDUE)
  dueDate: datetime (indexed)
  paymentTransactionId: UUID (FK -> transactions.id, nullable)
  createdAt: datetime
  updatedAt: datetime
  
  Indexes:
    - (saleTransactionId, installmentNumber)
    - (dueDate)
    - (status)
}
```

---

## 🔍 Verification Checklist

- [ ] Migration runs without errors
- [ ] `installments` table exists in DB with 11 columns
- [ ] Both listeners are registered in EventsModule
- [ ] InstallmentsModule imported in AppModule
- [ ] TransactionController accepts `numberOfInstallments` field
- [ ] Can create PURCHASE with 3 cuotas
- [ ] 3 installment records auto-created in DB
- [ ] Can register payment against installment
- [ ] Installment status updates from PENDING → PARTIAL/PAID
- [ ] GET /installments/transaction/{id} returns all cuotas
- [ ] GET /installments/cartera/{id} shows summary
- [ ] GET /installments/reports/overdue works
- [ ] GET /installments/reports/cartera-by-date works

---

## 📋 Files Summary

**Created:**
- `/backend/src/modules/installments/domain/installment.entity.ts`
- `/backend/src/modules/installments/domain/installment-status.enum.ts`
- `/backend/src/modules/installments/infrastructure/installment.repository.ts`
- `/backend/src/modules/installments/application/services/installment.service.ts`
- `/backend/src/modules/installments/presentation/installment.controller.ts`
- `/backend/src/modules/installments/presentation/dto/create-installment.dto.ts`
- `/backend/src/modules/installments/presentation/dto/installment.dto.ts`
- `/backend/src/modules/installments/installments.module.ts`
- `/backend/src/shared/listeners/create-installments.listener.ts`
- `/backend/src/shared/listeners/update-installment-from-payment.listener.ts`
- `/backend/migrations/1708595200000-CreateInstallmentsTable.ts`

**Modified:**
- `/backend/src/app.module.ts` - Added InstallmentsModule import
- `/backend/src/shared/events/events.module.ts` - Added both listeners

**Documentation:**
- `INSTALLMENTS_INTEGRATION.md` (this file)
- Plus 6 existing files from transaction analysis phase

---

## ⚠️ Important Notes

1. **Backwards Compatible:** All new fields in Transaction entity are nullable
2. **Automatic:** Listeners trigger automatically on event emission
3. **Non-Blocking:** Listener errors don't prevent transaction creation
4. **Logged:** All operations logged with transaction/installment IDs
5. **Indexed:** Key queries are optimized with database indexes

---

## 🛠️ Troubleshooting

### Migration fails
```bash
# See migration errors
npm run typeorm -- migration:show

# Revert if needed
npm run typeorm -- migration:revert
```

### Listeners not triggering
- Check EventsModule is imported in AppModule
- Verify both listeners are in EventsModule providers
- Check app logs for listener registration

### Query returns empty
- Verify transaction has `numberOfInstallments > 1`
- Check installments were created: `SELECT * FROM installments;`
- Verify TransactionService passes metadata to listener

---

## 📞 Support

For questions about:
- **Architecture:** See Architecture Summary section
- **Testing:** See Immediate Next Steps section
- **Database:** See Verification Checklist
- **API:** See Controller files for endpoint details

---

**Last Updated:** 22 de febrero de 2026  
**Next Review:** After database migration execution
