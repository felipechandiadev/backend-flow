# CashSession Services - Integration Next Steps

**Status**: Extraction phase COMPLETED ✅  
**Phase**: Integration phase (2.5-3 hours estimated)  
**Files created**:
- ✅ `cash-session-core.service.ts` (150 lines)
- ✅ `sales-from-session.service.ts` (150 lines)
- ✅ `session-inventory.service.ts` (120 lines)
- ✅ Updated `cash-sessions.module.ts`

---

## Immediate Tasks (Next 30 min - Build Test)

### 1. Verify Build Compiles

```bash
cd /Users/felipe/dev/flow-store/backend
npm run build
```

**Expected**: No TypeScript errors
**If errors**: Missing entity imports or service injections in module

### 2. Find and Remove Old Service Usages

The old 786-line `CashSessionsService` is still being used somewhere. Find all usages:

```bash
grep -r "CashSessionsService" backend/src --include="*.ts" | grep -v "test\|spec"
# Results will show:
# - Controllers injecting old service
# - Other services injecting old service
# - Module exports (expected)
```

**Action**: For each usage in controllers/services:
- If it's a controller: Update to use new services (CashSessionCoreService, SalesFromSessionService)
- If it's a service: Refactor to inject only what it needs (single responsibility)

---

## Phase 1: Build Compatibility (1 hour)

### Step 1.1: Create Backward Compatibility Facade

To avoid breaking existing code, create a facade wrapper that delegates to new services:

```typescript
// File: old-cash-sessions.service.ts (Deprecated)
// This is a DEPRECATED service. Use CashSessionCoreService or SalesFromSessionService instead.

@Injectable()
export class CashSessionsService {
  constructor(
    private readonly coreService: CashSessionCoreService,
    private readonly salesService: SalesFromSessionService,
  ) {}

  // Forward old method calls to new services
  async open(dto) {
    return this.coreService.open(dto);
  }

  async getSales(sessionId) {
    return this.salesService.getSalesForSession(sessionId);
  }

  async createSale(dto) {
    return this.salesService.createSale(dto);
  }

  // ... other method forwards
}
```

**Result**: Old code still works, but now delegates to new services
**Timeline**: 15 min

### Step 1.2: Update Module Exports

```typescript
// cash-sessions.module.ts
export class CashSessionsModule {}

// Now exports:
// - CashSessionCoreService (preferred for session operations)
// - SalesFromSessionService (preferred for sale creation)
// - SessionInventoryService (preferred for stock)
// - CashSessionsService (deprecated facade, for backward compatibility)
```

**Result**: New code can import new services directly
**Timeline**: 5 min

### Step 1.3: Update Controllers

```typescript
// OLD:
constructor(private cashSessionsService: CashSessionsService) {}

async openSession(dto) {
  return this.cashSessionsService.open(dto);
}

// NEW:
constructor(private coreService: CashSessionCoreService) {}

async openSession(dto) {
  return this.coreService.open(dto);
}
```

**Result**: Controllers use focused services
**Timeline**: 20 min

### Step 1.4: Verify Dependencies

```bash
# Check for circular dependencies
npm run build -- --listFiles | grep "cash-sessions"

# Check that tests pass (if any)
npm run test -- cash-sessions
```

**Result**: No build or test failures
**Timeline**: 15 min

---

## Phase 2: TransactionsService Integration (1.5 hours)

### Step 2.1: Implement CashSessionCoreService.open() → CASH_SESSION_OPENING

**File**: `cash-session-core.service.ts`  
**Method**: `open()`

Current (TODO marker):
```typescript
// TODO: Llamar a TransactionsService.createTransaction() para crear transacción CASH_SESSION_OPENING
```

Implementation:
```typescript
constructor(
  private readonly cashSessionRepository: Repository<CashSession>,
  private readonly pointOfSaleRepository: Repository<PointOfSale>,
  private readonly userRepository: Repository<User>,
  private readonly dataSource: DataSource,
  private readonly transactionsService: TransactionsService,  // <-- ADD
) {}

async open(openDto: OpenCashSessionDto) {
  // ... validation code (unchanged)
  
  // Create session
  const result = await this.dataSource.transaction(async (manager) => { ... });

  // NEW: Delegate to TransactionsService for CASH_SESSION_OPENING transaction
  try {
    const openingTx = await this.transactionsService.createTransaction({
      transactionType: TransactionType.CASH_SESSION_OPENING,
      amount: openingAmount,
      cashSessionId: result.id,
      userId: user.id,
      posId: pointOfSale.id,
      branchId: pointOfSale.branch?.id,
    });

    return {
      success: true,
      cashSession: { ...result },
      openingTransaction: {
        id: openingTx.id,
        documentNumber: openingTx.documentNumber,
        asientos: openingTx.metadata?.ledgerEntriesGenerated,
      },
    };
  } catch (err) {
    // Rollback session if transaction creation fails
    await this.cashSessionRepository.remove(result);
    throw err;
  }
}
```

**Expected Result**:
- ✅ CASH_SESSION_OPENING transaction created
- ✅ 2 asientos auto-generated (debit cash, credit opening equity)
- ✅ Saldo caja increased
- ✅ V1-V3 validations enforced

**Timeline**: 30 min

### Step 2.2: Implement CashSessionCoreService.close() → CASH_SESSION_CLOSING

**File**: `cash-session-core.service.ts`  
**Method**: `close()`

Expected implementation:
```typescript
async close(sessionId: string, userId: string) {
  const session = await this.cashSessionRepository.findOne({ where: { id: sessionId } });
  
  // Validate + calculate expectedAmount from related sales
  const expectedAmount = await this.calculateExpectedAmount(sessionId);
  
  // Delegate to TransactionsService for CASH_SESSION_CLOSING
  const closingTx = await this.transactionsService.createTransaction({
    transactionType: TransactionType.CASH_SESSION_CLOSING,
    amount: expectedAmount,
    cashSessionId: sessionId,
    userId,
    // ...
  });

  // Update session status = CLOSED
  session.closedById = userId;
  session.closedAt = new Date();
  session.status = CashSessionStatus.CLOSED;
  session.closingAmount = expectedAmount;
  await this.cashSessionRepository.save(session);

  // TODO: Call SessionInventoryService.commitStock(sessionId)
  // to finalize inventory reservations

  return {
    success: true,
    session,
    closingTransaction: closingTx,
  };
}

private async calculateExpectedAmount(sessionId: string): Promise<number> {
  // SELECT SUM(total) FROM transactions 
  // WHERE cash_session_id = ? AND type = SALE
  // + session.openingAmount
}
```

**Expected Result**:
- ✅ CASH_SESSION_CLOSING transaction created
- ✅ 2 asientos auto-generated (debit opening equity, credit cash)
- ✅ Saldo caja decreased
- ✅ Session status = CLOSED

**Timeline**: 30 min

### Step 2.3: Implement SalesFromSessionService.createSale() → SALE

**File**: `sales-from-session.service.ts`  
**Method**: `createSale()`

Current (TODO marker):
```typescript
// TODO: DELEGAR a TransactionsService.createTransaction()
```

Implementation:
```typescript
constructor(
  // ... existing repositories
  private readonly transactionsService: TransactionsService,  // <-- ADD
) {}

async createSale(createSaleDto: CreateSaleDto) {
  const { cashSessionId, customerId, lines, total, userId, ... } = createSaleDto;
  
  // ... validation code
  // ... calculate totals
  // ... create transaction + lines in current transaction
  
  // NEW: Delegate to TransactionsService for SALE transaction + asientos
  try {
    const finalTx = await this.transactionsService.createTransaction({
      transactionType: TransactionType.SALE,
      customerId,
      lines: transactionLines.map(l => ({
        productId: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        total: l.total,
      })),
      total,
      subtotal,
      taxAmount,
      discountAmount,
      userId,
      cashSessionId,
      forwardDocumentNumber: transaction.documentNumber, // Use existing temp num
    });

    // Update transaction to use final document number
    transaction.documentNumber = finalTx.documentNumber;
    await this.transactionRepository.save(transaction);

    // Reserve stock (if not already done)
    for (const line of lines) {
      await this.inventoryService.reserveStock(
        cashSessionId,
        line.productVariantId,
        line.quantity,
        storageId,
      );
    }

    return {
      success: true,
      transaction: finalTx,
      asientos: finalTx.metadata?.ledgerEntriesGenerated,
    };
  } catch (err) {
    // Rollback transaction + lines if asiento generation fails
    await this.transactionRepository.remove(transaction);
    throw err;
  }
}
```

**Expected Result**:
- ✅ SALE transaction created with unique documentNumber
- ✅ M asientos auto-generated (revenue, receivable/cash, COGS, inventory adjustment)
- ✅ V1-V7 validations enforced
- ✅ Stock reserved via SessionInventoryService

**Timeline**: 30 min

### Step 2.4: Test TransactionsService Integration

```bash
# Create integration test file
cat > backend/src/modules/cash-sessions/__tests__/integration.test.ts << 'EOF'
describe('CashSession Integration Tests', () => {
  it('should create CASH_SESSION_OPENING with auto-generated asientos', async () => {
    const result = await coreService.open({
      userName: 'cashier1',
      pointOfSaleId: 'pos-1',
      openingAmount: 1000,
    });

    expect(result.success).toBe(true);
    expect(result.openingTransaction).toBeDefined();
    expect(result.openingTransaction.asientos).toHaveLength(2);
    expect(result.openingTransaction.asientos[0].amount).toBe(1000); // debit
    expect(result.openingTransaction.asientos[1].amount).toBe(1000); // credit
  });

  it('should create SALE with auto-generated asientos', async () => {
    const result = await salesService.createSale({
      cashSessionId: 'session-1',
      customerId: 'customer-1',
      lines: [{ productVariantId: 'v1', quantity: 2, unitPrice: 100 }],
      total: 200,
    });

    expect(result.success).toBe(true);
    expect(result.asientos).toBeDefined();
    expect(result.asientos.length).toBeGreaterThan(2); // revenue + receivable + COGS + inventory
  });
});
EOF

npm run test -- cash-sessions
```

**Result**: All integration tests pass ✅

**Timeline**: 15 min

---

## Phase 3: InventoryAllocation Entity Modeling (1 hour)

### Step 3.1: Create InventoryAllocation Entity

```typescript
// File: backend/src/modules/inventory-allocations/domain/inventory-allocation.entity.ts

import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CashSession } from '@modules/cash-sessions/domain/cash-session.entity';
import { ProductVariant } from '@modules/product-variants/domain/product-variant.entity';

export enum AllocationStatus {
  RESERVED = 'RESERVED',
  COMMITTED = 'COMMITTED',
  RELEASED = 'RELEASED',
  CANCELLED = 'CANCELLED',
}

@Entity('inventory_allocations')
export class InventoryAllocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sessionId: string;

  @ManyToOne(() => CashSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: CashSession;

  @Column('uuid')
  productVariantId: string;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariant;

  @Column('int')
  qtyAllocated: number;

  @Column({
    type: 'enum',
    enum: AllocationStatus,
    default: AllocationStatus.RESERVED,
  })
  status: AllocationStatus;

  @Column('timestamp', { default: () => 'NOW()' })
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  committedAt?: Date;

  @Column('uuid', { nullable: true })
  storageId?: string;
}
```

**Timeline**: 20 min

### Step 3.2: Create Repository & Module

```typescript
// File: backend/src/modules/inventory-allocations/inventory-allocations.module.ts

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryAllocation,
      CashSession,
      ProductVariant,
    ]),
  ],
  providers: [InventoryAllocationsRepository],
  exports: [InventoryAllocationsRepository],
})
export class InventoryAllocationsModule {}
```

**Timeline**: 10 min

### Step 3.3: Implement SessionInventoryService with Real Entity

```typescript
// Update session-inventory.service.ts to use InventoryAllocation entity

@Injectable()
export class SessionInventoryService {
  constructor(
    private readonly allocRepository: Repository<InventoryAllocation>,
    // ... other repos
  ) {}

  async reserveStock(...) {
    const allocation = this.allocRepository.create({
      sessionId,
      productVariantId,
      qtyAllocated: qty,
      status: AllocationStatus.RESERVED,
      storageId,
    });
    return await this.allocRepository.save(allocation);
  }

  async commitStock(sessionId: string) {
    const reserved = await this.allocRepository.find({
      where: {
        sessionId,
        status: AllocationStatus.RESERVED,
      },
    });

    const committed = await Promise.all(
      reserved.map(async (alloc) => {
        const stockLevel = await this.stockLevelRepository.findOne({
          where: {
            productVariantId: alloc.productVariantId,
            storageId: alloc.storageId,
          },
        });

        if (stockLevel) {
          stockLevel.availableQty -= alloc.qtyAllocated;
          await this.stockLevelRepository.save(stockLevel);
        }

        alloc.status = AllocationStatus.COMMITTED;
        alloc.committedAt = new Date();
        return await this.allocRepository.save(alloc);
      }),
    );

    return { committed: committed.length, failed: 0 };
  }
}
```

**Timeline**: 15 min

### Step 3.4: Update CashSessionsModule

Add InventoryAllocationsModule to imports:

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([...]),
    TransactionsModule,
    InventoryAllocationsModule,  // <-- ADD
  ],
  // ...
})
export class CashSessionsModule {}
```

**Timeline**: 5 min

---

## Verification Checklist

After all phases complete, verify:

- [ ] `npm run build` passes (no TypeScript errors)
- [ ] No circular dependencies
- [ ] CashSessionCoreService.open() creates CASH_SESSION_OPENING with asientos
- [ ] SalesFromSessionService.createSale() creates SALE with asientos
- [ ] CashSessionCoreService.close() creates CASH_SESSION_CLOSING with asientos
- [ ] SessionInventoryService.commitStock() deducts from StockLevel
- [ ] No orphaned transactions (all have corresponding LedgerEntry records)
- [ ] Integration tests pass
- [ ] Old CashSessionsService deprecated (logged warnings)

---

## Rollout Strategy

1. **Day 1-2**: Build compatibility + TransactionsService integration
2. **Day 2-3**: InventoryAllocation entity + tests
3. **Day 3**: Staging deployment + E2E validation
4. **Day 4**: Production rollout (phased per POS)

---

## Success Criteria

✅ 786-line monolithic service → 3 focused services  
✅ 100% of CashSession operations → automatic asiento generation  
✅ V1-V7 validations enforced for all session transactions  
✅ Stock allocation tracked via two-phase commit  
✅ Integration tests passing  
✅ Zero breaking changes for API consumers  

---

**Next Step**: Run `npm run build` to verify compilation, then proceed with Phase 1 tasks.
