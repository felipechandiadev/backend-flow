# CashSessionsService Refactoring Guide

## Overview

`CashSessionsService` es un service **monolítico de 786 líneas** que viola SRP (Single Responsibility Principle) al mezclar:
1. Session management (open, close, reconcile)
2. Transaction creation (sales, line items)
3. Stock management (product reservations)
4. Metadata tracking (various flags)

Esta guía describe cómo **separar responsabilidades** y **integrar con TransactionsService**.

---

## Current Architecture (Monolithic)

```
CashSessionsService (786 lines)
├── openCashSession() .......................... ~60 lines | Session state
├── closeCashSession() ......................... ~80 lines | Session finalization
├── reconcileOpenCashSession() ................. ~70 lines | Reconciliation logic
├── createSaleFromPointOfSale() ............... ~180 lines | SALE TX creation + line items
├── addToExistingSession() ..................... ~90 lines | Session updates
├── createAdjustmentTransaction() ............. ~60 lines | ADJUSTMENT TX
├── getSessionSales() .......................... ~30 lines | Query
├── listSessions() ............................ ~40 lines | Query
├── getSessionStats() ......................... ~50 lines | Aggregation
└── Private helpers ........................... ~150 lines | Utilities
```

**Problems:**
- ❌ Can't test session logic independently (coupled to sale creation)
- ❌ Can't update session without understanding sale logic
- ❌ NO automatic ledger entry generation (asientos never created for sales in sessions)
- ❌ Metadata flags created but not consumed
- ❌ Stock changes NOT reflected in inventory system

---

## Target Architecture (Refactored)

```
CashSessionService (new) ...................... ~150 lines
├── openCashSession() .......................... ~30 lines
├── closeCashSession() ......................... ~40 lines
├── reconcileOpenCashSession() ................. ~50 lines
├── addMetadata() ............................ ~15 lines
└── Private helpers ........................... ~15 lines

SalesFromSessionService (new) ................. ~100 lines
├── createSaleFromPointOfSale(sessionId, dto)
├── addLineItem(saleId, lineItem)
├── updateLineItem(saleId, lineItemId, updates)
└── deleteLine Item(saleId, lineItemId)

SessionInventoryService (new) ................. ~80 lines
├── reserveStock(sessionId, productId, qty)
├── releaseStock(sessionId, productId, qty)
├── commitStock(sessionId)
└── rollbackStock(sessionId)
```

**Benefits:**
- ✅ Each service has single responsibility
- ✅ Easy to test independently
- ✅ Automatic ledger entry generation via TransactionsService
- ✅ Clear separation of concerns
- ✅ Stock changes properly tracked

---

## Step-by-Step Refactoring Plan

### Step 1: Analyze Current CashSessionsService (30 min)

**Goal**: Map exact methods, dependencies, and transaction types.

```bash
# Read full CashSessionsService
wc -l backend/src/modules/cash-sessions/application/cash-sessions.service.ts

# Extract method signatures
grep "async " backend/src/modules/cash-sessions/application/cash-sessions.service.ts

# Find all Repositories injected
grep "@InjectRepository" backend/src/modules/cash-sessions/application/cash-sessions.service.ts
```

**Expected Output:**
- 10-12 major methods
- 8-10 injected repositories
- Transaction types: CASH_SESSION_OPENING, CASH_SESSION_CLOSING, SALE, ADJUSTMENT

---

### Step 2: Extract CashSessionService (Session Management Only) (1 hour)

**File**: `/backend/src/modules/cash-sessions/application/cash-session-core.service.ts`

**Scope**: Session lifecycle ONLY

```typescript
@Injectable()
export class CashSessionCoreService {
  constructor(
    @InjectRepository(CashSession)
    private readonly cashSessionRepository: Repository<CashSession>,
    @InjectRepository(PointOfSale)
    private readonly pointOfSaleRepository: Repository<PointOfSale>,
    private readonly transactionsService: TransactionsService,
  ) {}

  /**
   * Open a cash session
   * 
   * Transaction created:
   * - Type: CASH_SESSION_OPENING
   * - Amount: openingAmount
   * - Audit: userId, POSId, timestamp
   * 
   * Delega a TransactionsService para:
   * - Generar documentNumber
   * - Crear asientos automáticamente
   * - Validaciones V1-V7
   */
  async openCashSession(openingAmount: number, userId: string, posId: string): Promise<CashSession> {
    // Logic:
    // 1. Find POS by ID
    // 2. Check no open session exists
    // 3. Create DTO for CASH_SESSION_OPENING transaction
    // 4. Call TransactionsService.createTransaction()
    // 5. Update CashSession status = OPEN, transactionId
    // 6. Return session
  }

  /**
   * Close a cash session
   * 
   * Transaction created:
   * - Type: CASH_SESSION_CLOSING
   * - Amount: totalCash (computed)
   * - Audit: userId, POSId, timestamp
   */
  async closeCashSession(sessionId: string, userId: string): Promise<CashSession> {
    // Logic:
    // 1. Load session
    // 2. Check status = OPEN
    // 3. Lock session (prevent further sales)
    // 4. Create DTO for CASH_SESSION_CLOSING transaction
    // 5. Call TransactionsService.createTransaction()
    // 6. Update session status = CLOSED, transactionId
    // 7. Unlock session
    // 8. Return session
  }

  /**
   * Reconcile session: compare physical count vs. system
   */
  async reconcileOpenCashSession(
    sessionId: string,
    physicalAmount: number,
  ): Promise<{ discrepancy: number; adjustmentTxId?: string }> {
    // Logic:
    // 1. Load session
    // 2. Calculate expectedAmount from sales
    // 3. Compare physical vs. expected
    // 4. If discrepancy: create ADJUSTMENT transaction
    // 5. Return { discrepancy, adjustmentTxId }
  }

  /**
   * Query: Get all sessions for a POS with pagination
   */
  async listSessions(posId: string, pagination: { page: number; limit: number }) {
    // Just query, no side effects
  }

  /**
   * Query: Get session statistics
   */
  async getSessionStats(sessionId: string) {
    // Aggregations: totalSales, totalPayments, totalExchange, discrepancies
  }
}
```

**Key Points:**
- ✅ Each method is self-contained
- ✅ All delegate transaction creation to TransactionsService
- ✅ Clear pre/post conditions documented
- ✅ No business logic for sales (extracted elsewhere)

---

### Step 3: Extract SalesFromSessionService (Sale Creation) (1.5 hours)

**File**: `/backend/src/modules/cash-sessions/application/sales-from-session.service.ts`

**Scope**: Sale transaction creation & line item management

```typescript
@Injectable()
export class SalesFromSessionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionLine)
    private readonly transactionLineRepository: Repository<TransactionLine>,
    private readonly transactionsService: TransactionsService,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
  ) {}

  /**
   * Create a SALE transaction from a cash session
   * 
   * IMPORTANT: Delega a TransactionsService para:
   * 1. Validaciones V1-V7 (saldo cliente, inventario, etc)
   * 2. Generación automática de asientos
   * 3. Documentación de auditoría
   */
  async createSaleFromPointOfSale(dto: CreateSaleFromSessionDto): Promise<Transaction> {
    // Logic:
    // 1. Validate session is OPEN
    // 2. Validate customer (if provided)
    // 3. Validate each line item (product exists, qty available)
    // 4. Build CreateTransactionDto with lines
    // 5. Call TransactionsService.createTransaction()
    // 6. Return transaction (with auto-generated asientos)
  }

  /**
   * Add line item to SALE (during creation or after)
   */
  async addLineItem(saleId: string, lineItem: CreateTransactionLineDto): Promise<TransactionLine> {
    // Logic:
    // 1. Load sale (must be CONFIRMED, not PAID)
    // 2. Validate product exists
    // 3. Check qty available
    // 4. Create TransactionLine
    // 5. Recalculate sale totals (subtotal, tax, discount, total)
    // 6. Trigger re-generation of asientos (LedgerEntriesService.regenerateForTransaction)
  }

  /**
   * Update existing line item
   */
  async updateLineItem(
    saleId: string,
    lineItemId: string,
    updates: Partial<CreateTransactionLineDto>,
  ): Promise<TransactionLine> {
    // Logic similar to addLineItem + update validation
  }

  /**
   * Delete line item (with undo of inventory allocation)
   */
  async deleteLineItem(
    saleId: string,
    lineItemId: string,
  ): Promise<{ success: boolean; asientosRolledBack: boolean }> {
    // Logic:
    // 1. Load sale + line item
    // 2. Check sale still EDITABLE
    // 3. Delete line item
    // 4. Recalculate sale totals
    // 5. Trigger re-generation of asientos
    // 6. Release inventory reservation
  }

  /**
   * Query: Get all sales in a session
   */
  async getSessionSales(sessionId: string) {
    // Just query with pagination/filters
  }
}
```

**Key Points:**
- ✅ All sale operations delegate to TransactionsService
- ✅ Line item changes trigger asiento regeneration
- ✅ Stock changes tracked separately (extracted to SessionInventoryService)
- ✅ No duplicate calculation of totals (delegated to TransactionsService)

---

### Step 4: Extract SessionInventoryService (Stock Management) (1 hour)

**File**: `/backend/src/modules/cash-sessions/application/session-inventory.service.ts`

**Scope**: Inventory reservations during session

```typescript
@Injectable()
export class SessionInventoryService {
  constructor(
    @InjectRepository(InventoryAllocation)
    private readonly inventoryAllocationRepository: Repository<InventoryAllocation>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Reserve stock for a sale in a session
   * 
   * Creates allocation record but does NOT deduct from available inventory yet
   * (Deduction occurs when session closes)
   */
  async reserveStock(
    sessionId: string,
    productId: string,
    qty: number,
  ): Promise<InventoryAllocation> {
    // Logic:
    // 1. Load product
    // 2. Check available qty >= qty requested
    // 3. Create InventoryAllocation record (status = RESERVED)
    // 4. Return allocation
  }

  /**
   * Release reserved stock (e.g., when sale is cancelled)
   */
  async releaseStock(allocationId: string): Promise<void> {
    // Logic:
    // 1. Load allocation (must be RESERVED)
    // 2. Update status = RELEASED
    // 3. Return
  }

  /**
   * Commit reserved stock to inventory deduction
   * Called when session closes
   */
  async commitStock(sessionId: string): Promise<{ committed: number; failed: number }> {
    // Logic:
    // 1. Find all RESERVED allocations for session
    // 2. For each: deduct from Product.availableQty, update allocation status = COMMITTED
    // 3. Create INVENTORY_ADJUSTMENT transaction if needed
    // 4. Return counts
  }

  /**
   * Rollback all reservations for a session (e.g., session cancelled)
   */
  async rollbackStock(sessionId: string): Promise<{ rolledBack: number }> {
    // Logic:
    // 1. Find all RESERVED allocations for session
    // 2. Update all statuses = CANCELLED
    // 3. Return count
  }

  /**
   * Query: Get current allocations for a session
   */
  async getAllocations(sessionId: string) {
    // Just query
  }
}
```

**Key Points:**
- ✅ Pure inventory logic (no transaction/accounting knowledge)
- ✅ Two-phase commit: reserve → confirm (when session closes)
- ✅ Easy to test independently

---

### Step 5: Update Modules & Providers (1 hour)

**File**: `/backend/src/modules/cash-sessions/cash-sessions.module.ts`

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CashSession,
      PointOfSale,
      Transaction,
      TransactionLine,
      InventoryAllocation,
      Product,
      LedgerEntry,
    ]),
    TransactionsModule,        // <-- NEW: for delegation
    LedgerEntriesModule,       // <-- NEW: for query methods
    ProductsModule,            // <-- NEW: for stock validation
    CustomersModule,           // <-- NEW: for customer validation
  ],
  providers: [
    CashSessionCoreService,       // <-- RENAMED from CashSessionsService
    SalesFromSessionService,      // <-- NEW
    SessionInventoryService,      // <-- NEW
    CashSessionsController,
  ],
  exports: [
    CashSessionCoreService,
    SalesFromSessionService,
    SessionInventoryService,
  ],
})
export class CashSessionsModule {}
```

**Breaking Change**: 
- Old: `CashSessionsService` (monolithic)
- New: `CashSessionCoreService` + `SalesFromSessionService` + `SessionInventoryService`

**Migration Strategy**:
1. Keep old service as facade (delegates to new services)
2. Gradually update callers to use new services
3. Deprecate old service after 2-3 sprints

---

### Step 6: Update Controllers (1 hour)

**File**: `/backend/src/modules/cash-sessions/presentation/cash-sessions.controller.ts`

```typescript
@Controller('cash-sessions')
export class CashSessionsController {
  constructor(
    private readonly cashSessionService: CashSessionCoreService,
    private readonly salesService: SalesFromSessionService,
    private readonly inventoryService: SessionInventoryService,
  ) {}

  @Post('open')
  async openSession(@Body() dto: OpenCashSessionDto) {
    // Delegate to CashSessionCoreService
    const session = await this.cashSessionService.openCashSession(
      dto.openingAmount,
      dto.userId,
      dto.posId,
    );

    return {
      success: true,
      session,
      // Key change: session now has auto-generated asiento
      asientoGenerated: session.metadata?.ledgerEntriesGenerated,
    };
  }

  @Post('sales')
  async createSale(@Body() dto: CreateSaleFromSessionDto) {
    // Delegate to SalesFromSessionService
    const sale = await this.salesService.createSaleFromPointOfSale(dto);

    return {
      success: true,
      sale,
      // Key change: asientos now auto-generated
      asientosCount: sale.metadata?.ledgerEntriesGenerated?.length,
    };
  }

  @Post('close')
  async closeSession(@Body() dto: CloseCashSessionDto) {
    // Delegate to CashSessionCoreService
    // Under the hood:
    // 1. Session closes
    // 2. CASH_SESSION_CLOSING transaction created
    // 3. Asientos auto-generated
    // 4. SessionInventoryService.commitStock() called
    const session = await this.cashSessionService.closeCashSession(
      dto.sessionId,
      dto.userId,
    );

    return {
      success: true,
      session,
      asientoGenerated: session.metadata?.ledgerEntriesGenerated,
    };
  }
}
```

**Key Changes**:
- ✅ Each endpoint now shows when asientos were generated
- ✅ No more manual accounting entry creation
- ✅ Stock changes tracked automatically

---

## Expected Benefits After Refactoring

### Code Quality
- 🟢 786 lines → 3 services of 150/100/80 lines (modular, testable)
- 🟢 SRP: Each service has single responsibility
- 🟢 Each service independently tested

### Accounting
- 🟢 CASH_SESSION_OPENING transactions create asientos automatically
- 🟢 CASH_SESSION_CLOSING transactions create asientos automatically
- 🟢 SALE transactions create asientos automatically
- 🟢 All V1-V10 validations enforced at transaction creation
- 🟢 NO more missing ledger entries

### Inventory
- 🟢 Stock reservations tracked during session
- 🟢 Two-phase commit: reserve → commit (on close)
- 🟢 Easy to reconcile: allocated qty vs. realized qty

### Testing
- 🟢 Unit tests for each service independently
- 🟢 Integration tests for full session flow
- 🟢 Scenario tests (e.g., session interrupted, reconciliation)

---

## Testing Plan After Refactoring

### Unit Tests (CashSessionCoreService)

```typescript
describe('CashSessionCoreService', () => {
  it('should open a cash session with auto-generated asiento', async () => {
    // Given: POS with no open session
    // When: openCashSession(100, userId, posId)
    // Then: 
    //   - CashSession created with status = OPEN
    //   - CASH_SESSION_OPENING transaction created
    //   - 2 asientos created (CASH_DEPOSIT credit, CASH debit)
    //   - Saldo caja updated
  });

  it('should close a cash session with auto-generated asiento', async () => {
    // Given: Open session with 3 sales totaling $50
    // When: closeCashSession(sessionId, userId)
    // Then:
    //   - CashSession status = CLOSED
    //   - CASH_SESSION_CLOSING transaction created
    //   - 2 asientos created (CASH credit, CASH_DEPOSIT debit)
    //   - Saldo caja updated
  });
});
```

### Integration Tests (Full Flow)

```typescript
describe('CashSession Full Flow', () => {
  it('should complete a full session: open -> sales -> close -> reconcile', async () => {
    // 1. openCashSession(100)
    //    ✓ Session OPEN
    //    ✓ $100 caja added
    // 2. createSale(Sale1, $50)
    //    ✓ SALE transaction + asientos (revenue, receivable)
    //    ✓ Stock allocated
    // 3. createSale(Sale2, $30)
    //    ✓ SALE transaction + asientos
    //    ✓ Stock allocated
    // 4. closeCashSession()
    //    ✓ Session CLOSED
    //    ✓ Stock committed
    //    ✓ Asientos finalized
    // 5. reconcile() with physical count
    //    ✓ Compare $100 + $50 + $30 - discounts vs. physical
    //    ✓ Create ADJUSTMENT if needed
  });
});
```

---

## Rollout Strategy

### Phase 1: Parallel Implementation (Week 1)
- ❌ Keep old CashSessionsService running
- ✅ Implement new services alongside
- ✅ Run E2E tests in staging
- ✅ Validate asientos generated correctly

### Phase 2: Cutover (Week 2)
- ❌ Deprecate old service (log warnings)
- ✅ Switch all new features to use new services
- ✅ Monitor in production for 1 week

### Phase 3: Cleanup (Week 3)
- ❌ Remove old service entirely
- ✅ Update all documentation

---

## Success Criteria

- ✅ All 786 lines of CashSessionsService → 3 focused services
- ✅ CASH_SESSION_OPENING → automatic asientos (V1, V2, V3 validated)
- ✅ SALE → automatic asientos (V1-V7 validated, including V5 saldo cliente)
- ✅ CASH_SESSION_CLOSING → automatic asientos (V1, V2, V3 validated)
- ✅ Stock reservations tracked throughout session
- ✅ 95%+ code coverage for new services
- ✅ E2E tests: complex session scenarios pass
- ✅ Zero breaking changes for API consumers

---

## Questions?

See main [REFACTORING_PROGRESS_COHERENCE.md](../REFACTORING_PROGRESS_COHERENCE.md) for overall progress.
