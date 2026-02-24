# Referencia Rápida: Tipos de Transacciones
**Actualizado:** 22 de febrero de 2026

---

## 🎯 Decisiones Rápidas por Tipo

### ¿Qué transacción debo crear?

#### Venta de joyería
```
SALE
├─ paymentMethod: CASH | CREDIT_CARD | CREDIT
├─ paymentStatus: PAID (si contado) | PENDING (si crédito)
└─ metadata: { itemsSold: 5, ... }
```

#### Cliente devuelve producto
```
SALE_RETURN
├─ relatedTransactionId: <SALE original>
├─ total: <= total SALE referenciada
└─ restraint: Debe existir SALE parent
```

#### Compra a proveedor
```
PURCHASE
├─ paymentMethod: TRANSFER | CHECK
├─ paymentStatus: PENDING (si crédito)
└─ targetStorageId: <bodega destino>
```

#### Transferencia entre bodegas
```
TRANSFER_OUT → TRANSFER_IN (par inseparable)
├─ TRANSFER_OUT: storageId (origen), targetStorageId (destino)
├─ TRANSFER_IN: relatedTransactionId → TRANSFER_OUT
└─ Líneas DEBEN ser iguales
```

#### Ajuste de inventario por robo
```
ADJUSTMENT_OUT
├─ metadata: { reason: 'THEFT', amount: 50000 }
└─ expenseCategoryId: <categoría de pérdida>
```

#### Cobro de cliente
```
PAYMENT_IN
├─ relatedTransactionId: <SALE original>
├─ amountPaid: $50,000 (puede ser parcial)
├─ paymentMethod: CASH | TRANSFER
└─ validation: No puede exceder deuda de cliente
```

#### Pago a proveedor
```
SUPPLIER_PAYMENT
├─ supplierId: <proveedor>
├─ relatedTransactionId: <PURCHASE original>
├─ paymentMethod: TRANSFER | CHECK
└─ validation: No puede exceder CxP con proveedor
```

#### Pago de arriendo
```
EXPENSE_PAYMENT
├─ expenseCategoryId: RENT
├─ amount: 500000
├─ paymentMethod: TRANSFER | CHECK
└─ result: Gasto registrado en accounting
```

#### Liquidación de nómina
```
PAYROLL
├─ employeeId: <empleado>
├─ resultCenterId: <centro de costo>
└─ metadata: { 
│   haberes: 500000,
│   aportaciones: 50000,
│   descuentos: 0
│ }
```

#### Apertura de caja
```
CASH_SESSION_OPENING
├─ cashSessionId: <sesión>
├─ total: 500000 (efectivo inicial)
└─ validation: Primera tx de la sesión
```

#### Retiro de efectivo de caja
```
CASH_SESSION_WITHDRAWAL
├─ cashSessionId: <sesión activa>
├─ total: 100000
└─ validation: CashSession.status = OPEN

// CASOS: Depósito al banco, cambio, caja chica
```

---

## 📋 Campos de Validación Obligatorios

### Por Tipo de Transacción

| Tipo | documentNumber | branchId | Relación | userId |
|------|---|---|---|---|
| SALE | ✅ | ✅ | ❌ | ✅ |
| SALE_RETURN | ✅ | ✅ | ✅ (Sale) | ✅ |
| PURCHASE | ✅ | ✅ | ❌ | ✅ |
| PURCHASE_ORDER | ✅ | ✅ | ❌ | ✅ |
| PURCHASE_RETURN | ✅ | ✅ | ✅ (Purchase) | ✅ |
| TRANSFER_OUT | ✅ | ✅ | ❌ | ✅ |
| TRANSFER_IN | ✅ | ✅ | ✅ (Transfer_Out) | ✅ |
| ADJUSTMENT_IN | ✅ | ✅ | ❌ | ✅ |
| ADJUSTMENT_OUT | ✅ | ✅ | ❌ | ✅ |
| PAYMENT_IN | ✅ | ✅ | ✅ (Sale) | ✅ |
| SUPPLIER_PAYMENT | ✅ | ✅ | ✅ (Purchase) | ✅ |
| EXPENSE_PAYMENT | ✅ | ✅ | ❌ | ✅ |
| PAYROLL | ✅ | ✅ | ❌ | ✅ |
| PAYMENT_EXECUTION | ✅ | ✅ | ✅ (Payroll) | ✅ |
| CASH_SESSION_OPENING | ✅ | ❌ | ✅ (CashSession) | ✅ |
| CASH_SESSION_WITHDRAWAL | ✅ | ❌ | ✅ (CashSession) | ✅ |
| CASH_DEPOSIT | ✅ | ✅ | ❌ | ✅ |
| OPERATING_EXPENSE | ✅ | ✅ | ❌ | ✅ |
| BANK_WITHDRAWAL_TO_SHAREHOLDER | ✅ | ✅ | ❌ | ✅ |

---

## 🔍 Queries Comunes

### Obtener todas las ventas sin cobrar
```sql
SELECT * FROM transactions 
WHERE transactionType = 'SALE' 
  AND paymentStatus IN ('PENDING', 'PARTIAL', 'OVERDUE')
ORDER BY paymentDueDate ASC;
```

### Obtener cuentas por cobrar relacionadas a una SALE
```sql
-- ACTUAL (sin jerarquía):
SELECT * FROM transactions 
WHERE relatedTransactionId = 'sale-123' 
  AND transactionType = 'PAYMENT_IN';

-- FASE 2 (con jerarquía):
SELECT * FROM transactions 
WHERE parentTransactionId = 'sale-123' 
  AND transactionType = 'PAYMENT_IN';
```

### Obtener todas las cuotas vencidas (FASE 2)
```sql
SELECT * FROM installments 
WHERE status IN ('PENDING', 'OVERDUE') 
  AND dueDate < CURRENT_DATE;
```

### Obtener estado de cartera de una venta (FASE 2)
```sql
SELECT 
  SUM(amount) as total_amount,
  SUM(amountPaid) as total_paid,
  SUM(amount - amountPaid) as pending_amount,
  COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paid_installments,
  COUNT(CASE WHEN status IN ('PENDING', 'PARTIAL', 'OVERDUE') THEN 1 END) as pending_installments
FROM installments 
WHERE saleTransactionId = 'sale-123';
```

---

## ⚠️ Errores Comunes

### 1. Crear PAYMENT_IN sin SALE referenciada
```typescript
❌ MALO:
await transactionRepo.create({
    transactionType: TransactionType.PAYMENT_IN,
    // NO hay relatedTransactionId!
});

✅ CORRECTO:
await transactionRepo.create({
    transactionType: TransactionType.PAYMENT_IN,
    relatedTransactionId: 'sale-123',
    customerId: customer.id,
});
```

### 2. Pagar más de lo adeudado
```typescript
❌ MALO:
const sale = { total: 100000 };
const paymentAmount = 100001;

✅ CORRECTO:
const totalPaid = await getPaidAmount(saleId);
const remainingDebt = sale.total - totalPaid;
if (paymentAmount > remainingDebt) {
    throw new Error('Payment exceeds debt');
}
```

### 3. Crear TRANSFER_IN sin TRANSFER_OUT
```typescript
❌ MALO:
await transactionRepo.create({
    transactionType: TransactionType.TRANSFER_IN,
    // NO hay relatedTransactionId!
});

✅ CORRECTO:
const transferOut = await createTransferOut(...);
await transactionRepo.create({
    transactionType: TransactionType.TRANSFER_IN,
    relatedTransactionId: transferOut.id,
});
```

### 4. Usar PAYMENT_OUT (DEPRECADO)
```typescript
❌ MALO:
await transactionRepo.create({
    transactionType: TransactionType.PAYMENT_OUT,
});

✅ CORRECTO:
// Para pago a proveedor:
await transactionRepo.create({
    transactionType: TransactionType.SUPPLIER_PAYMENT,
});

// Para pago de gastos:
await transactionRepo.create({
    transactionType: TransactionType.EXPENSE_PAYMENT,
});
```

---

## 🧮 Cálculos de Montos

### SALE
```
subtotal = Σ(línea.quantity * línea.unitPrice)
taxAmount = subtotal * 0.19 (IVA Chile)
discountAmount = si hay descuento en líneas
total = subtotal + taxAmount - discountAmount
```

### SALE_RETURN
```
subtotal != -original.subtotal  (depende de qué se devuelve)
taxAmount != -original.taxAmount
total <= -original.total
```

### ADJUSTMENT_OUT (robo/merma)
```
subtotal = cantidad * precioUnitario
taxAmount = 0 (pérdidas no tienen IVA)
// Se registra como gasto directo
```

---

## 📞 Contacto y Escalations

- **Preguntas sobre tipos:** GitHub Issue #transaction-types
- **Bugs en motor contable:** Slack #accounting-team
- **Propuesta de nuevo tipo:** Crear RFC

---

## 📚 Documentos Asociados

- [Análisis Detallado](./TRANSACTION_TYPES_ANALYSIS.md)
- [Plan de Implementación Fase 2](./TRANSACTION_RECOMMENDATIONS_IMPLEMENTATION.md)
- [Accounting Rules Engine](./accounting/ACCOUNTING_ENGINE.md)
- [Transaction Entity](../src/modules/transactions/domain/transaction.entity.ts)

---

**Última actualización:** 22 de febrero de 2026
