# Fase 2 Architecture Diagrams

## 1. High-Level System Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TRANSACTION CREATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

User Creates Purchase with 3 Installments
    ↓
    │ POST /transactions
    │ {
    │   "transactionType": "PURCHASE",
    │   "total": 3000,
    │   "numberOfInstallments": 3,
    │   "firstDueDate": "2026-03-01"
    │ }
    ↓
TransactionService.create()
    ↓
Transaction saved to DB
    ↓
EventEmitter.emit('transaction.created')
    ↓
    ├─→ CreateInstallmentsListener
    │   ├─ Check: numberOfInstallments > 1? ✓
    │   ├─ Check: transactionType ∈ [SALE, PURCHASE]? ✓
    │   ├─ Calculate dueDate intervals
    │   └─ InstallmentService.createInstallmentsForTransaction()
    │       ├─ Create Installment #1: $1000 due 2026-03-01
    │       ├─ Create Installment #2: $1000 due 2026-04-01
    │       ├─ Create Installment #3: $1000 due 2026-05-01
    │       └─ Saved to DB ✓
    │
    └─→ [Other listeners...]
        (accounting, payroll, etc.)
    ↓
Response returned to user
    ↓
3 cuotas visible in DB and API
```

---

## 2. Payment Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PAYMENT PROCESSING FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

User Registers Supplier Payment of $1000
    ↓
    │ POST /transactions
    │ {
    │   "transactionType": "SUPPLIER_PAYMENT",
    │   "total": 1000,
    │   "relatedTransactionId": "purchase-uuid"
    │ }
    ↓
TransactionService.create()
    ↓
Payment Transaction saved to DB
    ↓
EventEmitter.emit('transaction.created')
    ↓
    ├─→ UpdateInstallmentFromPaymentListener
    │   ├─ Check: transactionType ∈ [PAYMENT_IN, SUPPLIER_PAYMENT]? ✓
    │   ├─ Check: relatedTransactionId exists? ✓
    │   ├─ Get installments for related transaction
    │   │   └─ [Installment #1: PENDING, Installment #2: PENDING, Installment #3: PENDING]
    │   ├─ Find first PENDING/PARTIAL installment
    │   │   └─ Installment #1 (PENDING, $0 paid)
    │   └─ InstallmentService.updateInstallmentFromPayment()
    │       ├─ Update Installment #1:
    │       │   ├─ amountPaid: 0 → 1000
    │       │   ├─ status: PENDING → PAID
    │       │   └─ paymentTransactionId: linked
    │       └─ Saved to DB ✓
    │
    └─→ [Other listeners...]
        (accounting, etc.)
    ↓
Response returned to user
    ↓
Payment linked to Installment #1
Installment shows: PAID, $1000/$1000
```

---

## 3. Database Schema Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    INSTALLMENTS TABLE                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Column                Type           Constraints               │
│  ────────────────────────────────────────────────────────────   │
│  id                    UUID           PRIMARY KEY               │
│  saleTransactionId     UUID           UNIQUE, FK, INDEXED      │
│  installmentNumber     INTEGER        NOT NULL                  │
│  totalInstallments     INTEGER        NOT NULL                  │
│  amount                DECIMAL(15,2)  NOT NULL                  │
│  amountPaid            DECIMAL(15,2)  DEFAULT 0                 │
│  status                VARCHAR(20)    INDEXED (enum)            │
│  dueDate               TIMESTAMP      INDEXED                    │
│  paymentTransactionId  UUID           FK, NULLABLE              │
│  createdAt             TIMESTAMP      DEFAULT NOW()             │
│  updatedAt             TIMESTAMP      DEFAULT NOW()             │
│                                                                   │
│  INDEXES:                                                         │
│    1. Composite: (saleTransactionId, installmentNumber) - Fast  │
│    2. Single: (dueDate) - For date range queries               │
│    3. Single: (status) - For status filtering                  │
│                                                                   │
│  FOREIGN KEYS:                                                    │
│    - saleTransactionId → transactions(id)                       │
│    - paymentTransactionId → transactions(id)                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

Example Data: 3-Installment Purchase of $3000
┌─────────────────────────────────────────────────────────────────────────┐
│ installmentNumber │ amount │ amountPaid │  status  │     dueDate       │
├─────────────────────────────────────────────────────────────────────────┤
│        1          │ 1000   │    0       │ PENDING  │ 2026-03-01        │
│        2          │ 1000   │    0       │ PENDING  │ 2026-04-01        │
│        3          │ 1000   │    0       │ PENDING  │ 2026-05-01        │
└─────────────────────────────────────────────────────────────────────────┘

After First Payment ($1000):
┌─────────────────────────────────────────────────────────────────────────┐
│ installmentNumber │ amount │ amountPaid │  status  │     dueDate       │
├─────────────────────────────────────────────────────────────────────────┤
│        1          │ 1000   │   1000     │  PAID    │ 2026-03-01        │
│        2          │ 1000   │    0       │ PENDING  │ 2026-04-01        │
│        3          │ 1000   │    0       │ PENDING  │ 2026-05-01        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────┐
│                          APP MODULE                                 │
└─────────────────────────────────────────────────────────────────────┘
              ↓
    ┌─────────┴──────────────────┐
    ↓                            ↓
┌──────────────────┐    ┌──────────────────────┐
│  EventsModule    │    │ InstallmentsModule   │
└──────────────────┘    └──────────────────────┘
    ↓                            ↓
    ├─→ Listeners              ├─→ Repository
    │   ├─ AccountingEngine    │   └─ InstallmentRepository
    │   ├─ PayrollAPListener   │
    │   ├─ CreateInstallments  │   ├─→ Service
    │   └─ UpdateFromPayment   │   │   └─ InstallmentService
    │                          │
    ├─→ TypeOrmModule         ├─→ Controller
    │   └─ Transaction        │   └─ InstallmentController
    │
    └─→ LedgerEntriesModule   └─→ TypeOrmModule
        └─ (for accounting)      └─ Installment Entity

Dependency Flow:
  Listeners (EventsModule) → Service (InstallmentsModule)
  Service → Repository (InstallmentsModule)
  Repository → Entity (InstallmentsModule)
  Controller (InstallmentsModule) → Service
```

---

## 5. Event Listener Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│              CREATE INSTALLMENTS LISTENER                            │
└─────────────────────────────────────────────────────────────────────┘

Trigger: transaction.created event
    ↓
@OnEvent('transaction.created', { async: true })
    ↓
Guard Conditions:
    ├─ ❌ If transactionType NOT in [SALE, PURCHASE] → Return
    ├─ ❌ If numberOfInstallments ≤ 1 → Return
    └─ ✓ Both conditions pass → Continue
    ↓
Try/Catch Block:
    ├─ Fetch transaction metadata
    ├─ Calculate installment amount: total ÷ numberOfInstallments
    ├─ Calculate due dates: firstDueDate + 1 month * (n-1)
    ├─ Create installment entities
    ├─ Save to repository
    ├─ Log each creation
    │
    └─ Catch any errors:
       ├─ Log error with context
       ├─ Don't throw (non-blocking)
       └─ Transaction creation still succeeds

Result: 3 new Installment records in DB (async)


┌─────────────────────────────────────────────────────────────────────┐
│           UPDATE FROM PAYMENT LISTENER                              │
└─────────────────────────────────────────────────────────────────────┘

Trigger: transaction.created event
    ↓
@OnEvent('transaction.created', { async: true })
    ↓
Guard Conditions:
    ├─ ❌ If transactionType NOT in [PAYMENT_IN, SUPPLIER_PAYMENT] → Return
    ├─ ❌ If relatedTransactionId NOT provided → Return
    └─ ✓ Both conditions pass → Continue
    ↓
Try/Catch Block:
    ├─ Get all installments for related transaction
    ├─ ❌ If no installments → Log and return
    ├─ ✓ If installments found:
    │   ├─ Find first PENDING or PARTIAL installment
    │   ├─ ❌ If none → Log warning and return
    │   ├─ ✓ If found:
    │   │   ├─ Call updateInstallmentFromPayment()
    │   │   ├─ amountPaid += payment amount
    │   │   ├─ Recalculate status
    │   │   └─ Save to repository
    │   └─ Log update with details
    │
    └─ Catch any errors:
       ├─ Log error with context
       ├─ Don't throw (non-blocking)
       └─ Payment creation still succeeds

Result: Installment updated, status changed, payment linked (async)
```

---

## 6. API Endpoint Flow

```
┌──────────────────────────────────────────────────────────────────┐
│              INSTALLMENT CONTROLLER ENDPOINTS                    │
└──────────────────────────────────────────────────────────────────┘

GET /installments/transaction/{transactionId}
    ↓
    InstallmentController.getInstallmentsByTransaction()
    ↓
    InstallmentService.getInstallmentsByTransaction()
    ↓
    InstallmentRepository.getInstallmentsByTransaction()
    ↓
    SELECT * FROM installments 
    WHERE saleTransactionId = ? 
    ORDER BY installmentNumber
    ↓
    Response: InstallmentDto[]

────────────────────────────────────────────────────────────────────

GET /installments/cartera/{supplierId}
    ↓
    InstallmentController.getTransactionCarteraStatus()
    ↓
    InstallmentService.getTransactionCarteraStatus()
    ↓
    InstallmentRepository.getTransactionCarteraStatus()
    ↓
    Complex query:
    - SUM(amount) as totalAmount
    - SUM(amountPaid) as totalPaid
    - COUNT(*) by status
    - COUNT(*) overdue
    ↓
    Response: TransactionCarteraSummaryDto

────────────────────────────────────────────────────────────────────

GET /installments/reports/overdue
    ↓
    InstallmentController.getOverdueReport()
    ↓
    InstallmentService.getOverdueReport()
    ↓
    InstallmentRepository.getOverdueInstallments()
    ↓
    SELECT * FROM installments 
    WHERE status = 'OVERDUE' OR (dueDate < NOW() AND status != 'PAID')
    ORDER BY daysOverdue DESC
    ↓
    Response: OverdueReport { totalOverdue, overdueInstallments[] }

────────────────────────────────────────────────────────────────────

GET /installments/reports/cartera-by-date?fromDate=X&toDate=Y
    ↓
    InstallmentController.getCarteraByDueDate()
    ↓
    InstallmentService.getCarteraByDueDate()
    ↓
    InstallmentRepository.getCarteraByDueDate()
    ↓
    SELECT dueDate, 
           SUM(amount - amountPaid) as pending,
           SUM(CASE WHEN overdue THEN amount ELSE 0 END) as overdue
    FROM installments
    WHERE dueDate BETWEEN ? AND ?
    GROUP BY dueDate
    ↓
    Response: { dueDate, pendingAmount, overdueAmount }[]
```

---

## 7. Status Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                  INSTALLMENT STATUS TRANSITIONS                     │
└─────────────────────────────────────────────────────────────────────┘

                        ┌──────────────────┐
                        │   transitionned  │
                        │   (PENDING)      │
                        └────────┬─────────┘
                                 │
                    Payment amount < cuota amount
                                 │
                      ┌──────────▼──────────┐
                      │   PARTIAL (50%)    │
                      │   amountPaid: $500  │
                      └────────┬────────────┘
                               │
                    Payment amount = cuota amount
                               │
                      ┌────────▼──────────┐
                      │   PAID (100%)     │
                      │   amountPaid: $1000│
                      └───────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                         OVERDUE DETECTION                           │
└─────────────────────────────────────────────────────────────────────┘

    PENDING/PARTIAL + dueDate < TODAY
            ↓
         OVERDUE
            ↓
    Status = OVERDUE
    daysOverdue = TODAY - dueDate
    
Example:
    Installment due 2026-02-01
    Today is 2026-02-25
    daysOverdue = 24 days
```

---

## 8. Data Flow: From Transaction to Cartera

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE DATA FLOW EXAMPLE                            │
└─────────────────────────────────────────────────────────────────────────┘

Step 1: Create PURCHASE for $3000, 3 installments
  Input: { transactionType: "PURCHASE", total: 3000, numberOfInstallments: 3 }
  ↓

Step 2: Transaction saved
  transactions table:
  | id: tx-1 | transactionType: PURCHASE | total: 3000 | ... |
  ↓

Step 3: Listener auto-creates installments
  installments table:
  | id: inst-1 | saleTransactionId: tx-1 | installmentNumber: 1 | amount: 1000 | status: PENDING |
  | id: inst-2 | saleTransactionId: tx-1 | installmentNumber: 2 | amount: 1000 | status: PENDING |
  | id: inst-3 | saleTransactionId: tx-1 | installmentNumber: 3 | amount: 1000 | status: PENDING |
  ↓

Step 4: User pays $1000 (SUPPLIER_PAYMENT, relatedTransactionId: tx-1)
  transactions table:
  | id: tx-2 | transactionType: SUPPLIER_PAYMENT | total: 1000 | relatedTransactionId: tx-1 |
  ↓

Step 5: Listener updates first installment
  installments table:
  | id: inst-1 | saleTransactionId: tx-1 | installmentNumber: 1 | amountPaid: 1000 | status: PAID |
  | id: inst-2 | saleTransactionId: tx-1 | installmentNumber: 2 | amountPaid: 0 | status: PENDING |
  | id: inst-3 | saleTransactionId: tx-1 | installmentNumber: 3 | amountPaid: 0 | status: PENDING |
  ↓

Step 6: Query cartera summary
  GET /installments/cartera/{supplierId}
  Response: {
    totalOutstanding: 2000,  (1000 + 1000)
    totalPaid: 1000,
    totalOverdue: 0,
    installmentsByStatus: {
      PENDING: 2,
      PAID: 1,
      PARTIAL: 0,
      OVERDUE: 0
    }
  }
```

---

## Summary

This Fase 2 implementation provides:
- ✅ Automatic installment creation
- ✅ Automatic payment processing
- ✅ Advanced querying and reporting
- ✅ Non-blocking event-driven architecture
- ✅ Production-ready error handling

All diagrams show the actual data flow and system architecture implemented.
