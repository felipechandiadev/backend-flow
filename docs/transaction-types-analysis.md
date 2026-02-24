# Análisis de Tipos de Transacciones

**Fecha:** 22 de febrero de 2026  
**Propósito:** Documentación de referencia para análisis de arquitectura

---

## Tipos de Transacciones Actuales

Sistema Flow Store cuenta actualmente con **22 tipos de transacciones** diferentes.

---

## 1. VENTAS Y DEVOLUCIONES

### SALE
- **Descripción:** Venta a cliente
- **Afecta:** Inventario (salida), Cuentas por Cobrar, Ingresos
- **Relaciones:** Customer, CashSession, PointOfSale

### SALE_RETURN
- **Descripción:** Devolución de venta
- **Afecta:** Inventario (entrada), Cuentas por Cobrar, Ingresos (reversa)
- **Relaciones:** Customer, relatedTransactionId → SALE original

---

## 2. COMPRAS Y DEVOLUCIONES

### PURCHASE
- **Descripción:** Compra a proveedor
- **Afecta:** Inventario (entrada), Cuentas por Pagar, Costos
- **Relaciones:** Supplier, Storage

### PURCHASE_ORDER
- **Descripción:** Orden de compra (no afecta inventario aún)
- **Afecta:** Control de pedidos pendientes
- **Relaciones:** Supplier

### PURCHASE_RETURN
- **Descripción:** Devolución de compra
- **Afecta:** Inventario (salida), Cuentas por Pagar, Costos (reversa)
- **Relaciones:** Supplier, relatedTransactionId → PURCHASE original

---

## 3. MOVIMIENTOS DE INVENTARIO

### TRANSFER_OUT
- **Descripción:** Salida por transferencia entre bodegas
- **Afecta:** Inventario bodega origen (salida)
- **Relaciones:** Storage (origen), targetStorageId (destino)

### TRANSFER_IN
- **Descripción:** Entrada por transferencia entre bodegas
- **Afecta:** Inventario bodega destino (entrada)
- **Relaciones:** Storage (destino), relatedTransactionId → TRANSFER_OUT

### ADJUSTMENT_IN
- **Descripción:** Ajuste de inventario positivo
- **Afecta:** Inventario (entrada), Gastos/Ingresos por ajuste
- **Uso:** Corrección de diferencias de inventario, mermas recuperadas

### ADJUSTMENT_OUT
- **Descripción:** Ajuste de inventario negativo
- **Afecta:** Inventario (salida), Gastos por merma
- **Uso:** Robos, roturas, productos vencidos

---

## 4. PAGOS Y COBROS

### PAYMENT_IN
- **Descripción:** Pago recibido de cliente
- **Afecta:** Caja/Banco (entrada), Cuentas por Cobrar (salida)
- **Relaciones:** Customer, relatedTransactionId → SALE
- **Uso:** Cobro de ventas a crédito

### PAYMENT_OUT
- **Descripción:** Pago genérico ⚠️ **DEPRECADO**
- **Estado:** Se recomienda usar SUPPLIER_PAYMENT o EXPENSE_PAYMENT
- **Afecta:** Caja/Banco (salida), Cuentas por Pagar (salida)
- **Nota:** Mantenido por compatibilidad

### SUPPLIER_PAYMENT
- **Descripción:** Pago a proveedor por compras
- **Afecta:** Caja/Banco (salida), Cuentas por Pagar (salida)
- **Relaciones:** Supplier, relatedTransactionId → PURCHASE
- **Uso:** Liquidación de facturas de proveedores

### EXPENSE_PAYMENT
- **Descripción:** Pago de gastos operativos
- **Afecta:** Caja/Banco (salida), Gastos Operativos
- **Relaciones:** ExpenseCategory, Supplier (opcional)
- **Uso:** Servicios, arriendo, utilities, etc.

---

## 5. NÓMINA Y REMUNERACIONES

### PAYROLL
- **Descripción:** Liquidación de remuneraciones
- **Afecta:** Cuentas por Pagar (empleados, AFP, Isapres, etc.)
- **Relaciones:** Employee, ResultCenter
- **Metadata:** Contiene detalle de haberes, descuentos, leyes sociales

### PAYMENT_EXECUTION
- **Descripción:** Ejecución de pago de nómina
- **Afecta:** Caja/Banco (salida), Cuentas por Pagar (salida)
- **Relaciones:** Employee, relatedTransactionId → PAYMENT_OUT (del PAYROLL)
- **Uso:** Pago efectivo de sueldos, AFP, Fonasa, etc.

---

## 6. GESTIÓN DE CAJA

### CASH_SESSION_OPENING
- **Descripción:** Apertura formal de caja para una sesión
- **Afecta:** CashSession.openingBalance
- **Relaciones:** CashSession, PointOfSale, User
- **Uso:** Registrar efectivo inicial al abrir turno

### CASH_SESSION_CLOSING
- **Descripción:** Cierre contable de sesión de caja
- **Afecta:** CashSession.closingBalance, resultados del período
- **Relaciones:** CashSession
- **Uso:** Cuadre de caja al finalizar turno

### CASH_SESSION_WITHDRAWAL
- **Descripción:** Retiro manual de efectivo desde la sesión
- **Afecta:** Efectivo en caja (salida)
- **Relaciones:** CashSession
- **Uso:** Arqueos, depósitos al banco, cambios

### CASH_SESSION_DEPOSIT
- **Descripción:** Ingreso manual de efectivo para reforzar la sesión
- **Afecta:** Efectivo en caja (entrada)
- **Relaciones:** CashSession
- **Uso:** Alimentar fondo de cambio

---

## 7. GASTOS OPERATIVOS

### OPERATING_EXPENSE
- **Descripción:** Gasto operativo directo
- **Afecta:** Gastos, Caja/Banco (salida)
- **Relaciones:** ExpenseCategory, Branch, ResultCenter
- **Uso:** Registro inmediato de gastos menores

### CASH_DEPOSIT
- **Descripción:** Depósito de efectivo en banco
- **Afecta:** Banco (entrada), Caja (salida)
- **Relaciones:** BankAccount
- **Uso:** Transferencias de efectivo a cuenta bancaria

---

## 8. RETIROS DE CAPITAL

### BANK_WITHDRAWAL_TO_SHAREHOLDER
- **Descripción:** Egreso bancario a socio
- **Afecta:** Banco (salida), Patrimonio/Cuentas por Cobrar Socios
- **Relaciones:** Shareholder, BankAccount
- **Uso:** Retiros de utilidades, préstamos a socios

---

## Resumen por Categoría

| Categoría | Tipos | Total |
|-----------|-------|-------|
| **Ventas** | SALE, SALE_RETURN | 2 |
| **Compras** | PURCHASE, PURCHASE_ORDER, PURCHASE_RETURN | 3 |
| **Inventario** | TRANSFER_OUT, TRANSFER_IN, ADJUSTMENT_IN, ADJUSTMENT_OUT | 4 |
| **Pagos/Cobros** | PAYMENT_IN, PAYMENT_OUT, SUPPLIER_PAYMENT, EXPENSE_PAYMENT | 4 |
| **Nómina** | PAYROLL, PAYMENT_EXECUTION | 2 |
| **Caja** | CASH_SESSION_OPENING, CASH_SESSION_CLOSING, CASH_SESSION_WITHDRAWAL, CASH_SESSION_DEPOSIT | 4 |
| **Gastos** | OPERATING_EXPENSE, CASH_DEPOSIT | 2 |
| **Capital** | BANK_WITHDRAWAL_TO_SHAREHOLDER | 1 |
| **TOTAL** | | **22** |

---

## Campos Clave de la Entidad Transaction

### Relaciones Actuales
```typescript
relatedTransactionId?: string;  // Relación genérica 1-a-1
```

**Limitaciones Actuales:**
- ❌ No hay jerarquía parent-children
- ❌ No hay OneToMany inverso para relatedTransaction
- ❌ No hay modelado de cuotas/installments
- ❌ No hay tipo específico para anulaciones (se usa status: VOIDED)

### Campos de Control de Pagos
```typescript
paymentDueDate?: Date;           // Fecha de vencimiento (UNA sola)
paymentStatus?: PaymentStatus;   // PENDING, PAID, PARTIAL, OVERDUE, VOIDED
amountPaid: number;              // Control de pagos parciales
```

**Limitaciones:**
- ✅ Controla si está pagado o no
- ❌ No controla CUÁNTAS cuotas ni CUÁLES están pagadas

---

## Recomendaciones de Arquitectura

### Mejoras Propuestas

#### 1. Agregar Jerarquía (Opcional)
```typescript
@Column({ type: 'uuid', nullable: true })
parentTransactionId?: string;

@ManyToOne(() => Transaction, t => t.children)
parent?: Transaction;

@OneToMany(() => Transaction, t => t.parent)
children?: Transaction[];
```

**Casos de uso:**
- PAYROLL → múltiples PAYMENT_EXECUTION
- SALE → múltiples PAYMENT_IN parciales
- Anulaciones con trazabilidad

#### 2. Crear Tabla `installments` (Recomendado)
Para control de cuotas sin modificar el motor de transacciones:
```typescript
@Entity('installments')
export class Installment {
  @Column() saleTransactionId: string;
  @Column() installmentNumber: number;
  @Column() totalInstallments: number;
  @Column() amount: number;
  @Column() dueDate: Date;
  @Column() amountPaid: number;
  @Column() status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE';
  @Column({ nullable: true }) paymentTransactionId?: string;
}
```

#### 3. Crear Tipo `VOID_ADJUSTMENT`
Para anulaciones trazables en lugar de solo cambiar status.

---

## Estado Actual del Sistema

**✅ Fortalezas:**
- Diversidad de tipos para casos específicos
- Campo `metadata` para extensibilidad
- Inmutabilidad (solo `createdAt`, sin `updatedAt`)
- Motor contable con 16+ reglas automáticas
- Integración con sesiones de caja, períodos contables

**❌ Debilidades:**
- No hay control granular de cuotas
- `relatedTransactionId` es bidireccional sin inversa
- No hay jerarquía multinivel
- PAYMENT_OUT deprecado pero aún en uso
- Anulaciones sin trazabilidad estructural

---

## Conclusión

El sistema actual es **adecuado para retail con crédito simple**, pero requiere mejoras para:
- Cartera por cobrar compleja (múltiples cuotas)
- Trazabilidad de anulaciones
- Jerarquías de transacciones compuestas

Las mejoras propuestas son **incrementales** y no requieren reescribir el motor existente.
