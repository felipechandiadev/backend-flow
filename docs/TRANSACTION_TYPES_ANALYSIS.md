# Análisis de Tipos de Transacciones
**Fecha:** 22 de febrero de 2026  
**Propósito:** Documentación de referencia para análisis de arquitectura  
**Versión:** 1.0

---

## 📊 Tipos de Transacciones Actuales

El sistema **Flow Store** cuenta actualmente con **22 tipos de transacciones** diferentes, organizadas en 8 categorías principales.

---

## 1. VENTAS Y DEVOLUCIONES (2 tipos)

### SALE
- **Descripción:** Venta a cliente
- **Afecta:** 
  - Inventario (salida)
  - Cuentas por Cobrar
  - Ingresos
- **Relaciones:** Customer, CashSession, PointOfSale, TransactionLine[]
- **PaymentStatus Permitido:** PENDING (si es crédito), PAID (si es contado)
- **Casos de Uso:**
  - Venta contado en punto de venta
  - Venta a crédito a cliente registrado
  - Venta mayorista con descuento

### SALE_RETURN
- **Descripción:** Devolución de venta
- **Afecta:**
  - Inventario (entrada)
  - Cuentas por Cobrar (reversa/ajuste)
  - Ingresos (reversa)
- **Relaciones:** Customer, relatedTransactionId → SALE original
- **Restricción:** Debe existir SALE relacionada
- **Validación:** total <= total de SALE referenciada
- **Casos de Uso:**
  - Cliente devuelve producto defectuoso
  - Producto no es lo esperado
  - Cambio por otro producto

---

## 2. COMPRAS Y DEVOLUCIONES (3 tipos)

### PURCHASE
- **Descripción:** Compra a proveedor
- **Afecta:**
  - Inventario (entrada)
  - Cuentas por Pagar
  - Costos de Venta
- **Relaciones:** Supplier, Storage (destino), TransactionLine[]
- **PaymentStatus Permitido:** PENDING (si es crédito), PAID (si es contado)
- **Casos de Uso:**
  - Compra de materia prima con crédito 30-90 días
  - Compra de joyería para venta
  - Compra de suministros de empaque

### PURCHASE_ORDER
- **Descripción:** Orden de compra (pedido pendiente)
- **Afecta:** Control de pedidos pendientes (sin impacto en inventario)
- **Status Permitido:** DRAFT, CONFIRMED, CANCELLED
- **Relaciones:** Supplier, TransactionLine[]
- **Nota:** No genera movimiento de inventario hasta PURCHASE
- **Casos de Uso:**
  - Especialista de presupuestos crea orden
  - Jefe de compras autoriza
  - Se espera recepción de mercadería

### PURCHASE_RETURN
- **Descripción:** Devolución de compra a proveedor
- **Afecta:**
  - Inventario (salida)
  - Cuentas por Pagar (reversa/ajuste)
  - Costos (reversa)
- **Relaciones:** Supplier, relatedTransactionId → PURCHASE original
- **Restricción:** Debe existir PURCHASE relacionada
- **Casos de Uso:**
  - Producto defectuoso recibido
  - Cantidad incorrecta
  - Cambio por otro producto con proveedor

---

## 3. MOVIMIENTOS DE INVENTARIO (4 tipos)

### TRANSFER_OUT
- **Descripción:** Salida por transferencia entre bodegas
- **Afecta:** Inventario bodega origen (salida)
- **Relaciones:** Storage (origen), targetStorageId (destino)
- **Restricción:** branchId debe ser igual en origen y destino
- **Casos de Uso:**
  - Transferencia bodega principal → bodega sucursal
  - Reposición de piso de venta desde bodega
  - Consolidación de inventario

### TRANSFER_IN
- **Descripción:** Entrada por transferencia entre bodegas
- **Afecta:** Inventario bodega destino (entrada)
- **Relaciones:** Storage (destino), relatedTransactionId → TRANSFER_OUT
- **Nota:** Siempre debe existir TRANSFER_OUT relacionado (par inseparable)
- **Validación:** Líneas iguales a TRANSFER_OUT

### ADJUSTMENT_IN
- **Descripción:** Ajuste de inventario positivo
- **Afecta:**
  - Inventario (entrada)
  - Gastos/Ingresos por ajuste
- **Casos de Uso:**
  - Corrección de diferencias de conteo físico
  - Recuperación de mercadería extraviada
  - Rectificación de inventario anterior

### ADJUSTMENT_OUT
- **Descripción:** Ajuste de inventario negativo
- **Afecta:**
  - Inventario (salida)
  - Gasto por merma
- **Casos de Uso:**
  - Robos internos detectados
  - Roturas y daños irrecuperables
  - Productos vencidos descartados
  - Diferencias de inventario negativas

---

## 4. PAGOS Y COBROS (4 tipos)

### PAYMENT_IN
- **Descripción:** Pago recibido de cliente
- **Afecta:**
  - Caja/Banco (entrada)
  - Cuentas por Cobrar (salida/reducción)
- **Relaciones:** Customer, relatedTransactionId → SALE
- **PaymentStatus:** PAID (se marca como pagado)
- **Casos de Uso:**
  - Cobro de venta a plazo después de 30 días
  - Abono parcial de deuda de cliente
  - Cobro en cheque diferido que se protestó
- **Restricción:** No puede exceder deuda pendiente

### PAYMENT_OUT
- **Descripción:** Pago genérico
- **Estado:** ⚠️ **DEPRECADO**
- **Recomendación:** Usar SUPPLIER_PAYMENT o EXPENSE_PAYMENT
- **Razón:** No hay especificidad sobre tipo de pago
- **Nota:** Mantenido por compatibilidad con datos históricos
- **Validación:** Sistema debe rechazar nuevos registros de este tipo

### SUPPLIER_PAYMENT
- **Descripción:** Pago a proveedor por compras
- **Afecta:**
  - Caja/Banco (salida)
  - Cuentas por Pagar (salida/reducción)
- **Relaciones:** Supplier, relatedTransactionId → PURCHASE
- **PaymentMethod:** TRANSFER, CHECK, CASH, CREDIT_CARD
- **Casos de Uso:**
  - Pago de factura de compra al vencimiento
  - Pago anticipado a proveedor
  - Liquidación de abono parcial
- **Restricción:** No puede exceder deuda con proveedor

### EXPENSE_PAYMENT
- **Descripción:** Pago de gastos operativos
- **Afecta:**
  - Caja/Banco (salida)
  - Gastos Operativos (por categoría)
- **Relaciones:** ExpenseCategory, Supplier (opcional), ResultCenter
- **ExpenseCategory Válidas:** Todas excepto categorías de venta
- **Casos de Uso:**
  - Arriendo mensual (RENT)
  - Factura de servicios básicos (UTILITIES_*)
  - Honorarios de contador (ACCOUNTING)
  - Publicidad digital (MARKETING)
- **Nota:** Puede ir con o sin proveedor específico

---

## 5. NÓMINA Y REMUNERACIONES (2 tipos)

### PAYROLL
- **Descripción:** Liquidación de remuneraciones
- **Afecta:**
  - Cuentas por Pagar (empleados, AFP, Isapres, Fonasa)
  - Gastos por Remuneraciones
- **Relaciones:** Employee, ResultCenter, TransactionLine[]
- **Metadata Obligatorio:** Detalle de:
  - Haberes brutos
  - Descuentos legales (AFP, Isapres, Fonasa)
  - Imposiciones
  - Bonificaciones
  - Anticipo de sueldo
- **Casos de Uso:**
  - Liquidación de nómina mensual 1-30 empleados
  - Liquidación de aguinaldo
  - Liquidación de finiquito
- **Restricción:** Solo un PAYROLL activo por período (mes) por empleado

### PAYMENT_EXECUTION
- **Descripción:** Ejecución de pago de nómina
- **Afecta:**
  - Caja/Banco (salida)
  - Cuentas por Pagar (salida/reducción)
- **Relaciones:** Employee, relatedTransactionId → PAYROLL
- **PaymentMethod:** TRANSFER (recomendado), CASH, CREDIT_CARD
- **Casos de Uso:**
  - Pago de sueldo líquido a empleado
  - Depósito de AFP a administradora
  - Pago de Fonasa
  - Reembolso de isapre
- **Nota:** Puede ser múltiple por PAYROLL (varias cuotas)

---

## 6. GESTIÓN DE CAJA (4 tipos)

### CASH_SESSION_OPENING
- **Descripción:** Apertura formal de caja para una sesión
- **Afecta:** CashSession.openingBalance
- **Relaciones:** CashSession, PointOfSale, User
- **Validación:** Debe ser la primera transacción de una sesión
- **Metadata:** openingBalance registrado
- **Casos de Uso:**
  - Chequero de caja abre turno a las 08:00 AM
  - Monto inicial registrado: $500,000

### CASH_SESSION_CLOSING
- **Descripción:** Cierre contable de sesión de caja
- **Afecta:** CashSession.closingBalance, resultados del período
- **Relaciones:** CashSession
- **Validación:** Debe ser la última transacción de una sesión
- **Metadata:**
  - closingBalance final
  - Diferencia (over/under)
  - Detalle de arqueo
- **Casos de Uso:**
  - Chequero cierra turno a las 20:00 PM
  - Arqueo de caja registra $520,300
  - Diferencia reportada: $20,300 (sobra)

### CASH_SESSION_WITHDRAWAL
- **Descripción:** Retiro manual de efectivo desde la sesión
- **Afecta:** Efectivo en caja (salida)
- **Relaciones:** CashSession
- **Validación:** CashSession debe estar activo (OPEN)
- **Casos de Uso:**
  - Depósito de venta al banco (retiro de $100,000)
  - Cambio para cliente ($50,000 en billetes)
  - Alimentación de caja chica ($10,000)

### CASH_SESSION_DEPOSIT
- **Descripción:** Ingreso manual de efectivo para reforzar la sesión
- **Afecta:** Efectivo en caja (entrada)
- **Relaciones:** CashSession
- **Validación:** CashSession debe estar activo
- **Casos de Uso:**
  - Gerente entrega cambio a chequero ($20,000)
  - Reintegro de fondo de caja ($5,000)
  - Venta de tarjetas de prepago reembolsadas ($1,500)

---

## 7. GASTOS OPERATIVOS (2 tipos)

### OPERATING_EXPENSE
- **Descripción:** Gasto operativo directo (sin pago bancario)
- **Afecta:**
  - Gastos Operativos (por categoría)
  - Caja/Banco (salida)
- **Relaciones:** ExpenseCategory, Branch, ResultCenter, User
- **PaymentMethod:** CASH (inmediato)
- **Casos de Uso:**
  - Compra de café para oficina ($3,000 en efectivo)
  - Mantenimiento menor de aire acondicionado ($15,000 cash)
  - Flores de decoración ($2,500 cash)
- **Nota:** Gastos menores que se pagan sin necesidad de PURCHASE

### CASH_DEPOSIT
- **Descripción:** Depósito de efectivo en banco
- **Afecta:**
  - Banco (entrada)
  - Caja (salida)
- **Relaciones:** BankAccount, CashSession (opcional)
- **PaymentMethod:** TRANSFER (automático), CASH (manual)
- **Casos de Uso:**
  - Depósito diario de ventas a cuenta bancaria
  - Pago de nómina antes de cierre de bank
  - Liquidación de cambio excedente
- **Validación:** no puede ser > efectivo disponible en sesión

---

## 8. RETIROS DE CAPITAL (1 tipo)

### BANK_WITHDRAWAL_TO_SHAREHOLDER
- **Descripción:** Egreso bancario a socio/accionista
- **Afecta:**
  - Banco (salida)
  - Patrimonio o Cuentas por Cobrar Socios
- **Relaciones:** Shareholder, BankAccount
- **ApprovalThreshold:** RequiresApproval = true
- **MetadataObligatorio:** concepto (retiro de utilidades, préstamo, etc)
- **Casos de Uso:**
  - Retiro de utilidades distribuidas
  - Préstamo otorgado a socio
  - Pago de aportación de capital por devolución
- **Validación:** No puede exceder patrimonio disponible

---

## 📋 Resumen Cuantitativo

| Categoría | Tipos | Total | Estado |
|-----------|-------|-------|--------|
| **Ventas** | SALE, SALE_RETURN | 2 | ✅ Activo |
| **Compras** | PURCHASE, PURCHASE_ORDER, PURCHASE_RETURN | 3 | ✅ Activo |
| **Inventario** | TRANSFER_OUT, TRANSFER_IN, ADJUSTMENT_IN, ADJUSTMENT_OUT | 4 | ✅ Activo |
| **Pagos/Cobros** | PAYMENT_IN, PAYMENT_OUT, SUPPLIER_PAYMENT, EXPENSE_PAYMENT | 4 | ⚠️ PAYMENT_OUT deprecado |
| **Nómina** | PAYROLL, PAYMENT_EXECUTION | 2 | ✅ Activo |
| **Caja** | CASH_SESSION_OPENING, CASH_SESSION_CLOSING, CASH_SESSION_WITHDRAWAL, CASH_SESSION_DEPOSIT | 4 | ✅ Activo |
| **Gastos** | OPERATING_EXPENSE, CASH_DEPOSIT | 2 | ✅ Activo |
| **Capital** | BANK_WITHDRAWAL_TO_SHAREHOLDER | 1 | ✅ Activo |
| | | **22** | |

---

## 🔗 Relaciones Actuales

### Relación genérica 1-a-1
```typescript
@Column({ type: 'uuid', nullable: true })
relatedTransactionId?: string;

@ManyToOne(() => Transaction, { onDelete: 'SET NULL' })
@JoinColumn({ name: 'relatedTransactionId' })
relatedTransaction?: Transaction;
```

**Pares inseparables:**
- TRANSFER_OUT ↔ TRANSFER_IN
- SALE ↔ SALE_RETURN (retorno opcional)
- PURCHASE ↔ PURCHASE_RETURN (retorno opcional)
- SALE ↔ PAYMENT_IN (múltiples pagos)
- PURCHASE ↔ SUPPLIER_PAYMENT (múltiples pagos)
- PAYROLL ↔ PAYMENT_EXECUTION (múltiples ejecuciones)

---

## ❌ Limitaciones Actuales

### 1. Relaciones Bidireccionales Sin Inversa
- ✅ Existe relatedTransactionId en bd
- ❌ No hay @OneToMany inverso
- ❌ No se puede consultar "quién referencia a esta transacción"
- **Impacto:** Queries costosas para encontrar PAYMENT_IN asociados a SALE

### 2. No hay Jerarquía Parent-Children
- ❌ No se modela que PAYROLL puede tener múltiples PAYMENT_EXECUTION
- ❌ No se modela que SALE puede tener múltiples PAYMENT_IN parciales
- ❌ No se puede auditar "de dónde vino este pago"
- **Impacto:** Difícil rastrear flujo de dinero completo

### 3. No hay Modelado de Cuotas/Installments
- ❌ Solo hay paymentStatus binario (PAID/PARTIAL)
- ❌ No se controla CUÁL cuota fue pagada
- ❌ No se sabe vencimiento individual de cada cuota
- **Impacto:** Gestión de cartera incompleta, imposible generar reportes de morosidad por cuota

### 4. No hay Tipo Específico para Anulaciones
- ❌ Se usa status: VOIDED sin trazabilidad estructural
- ❌ No hay referencia a qué se está anulando
- ❌ No hay indicador de "motivo de anulación"
- **Impacto:** Auditoría débil, imposible generar reportes de anulaciones por motivo

### 5. Campos de Control de Pagos Incompletos
```typescript
paymentDueDate?: Date;           // UNA sola fecha (no múltiples cuotas)
paymentStatus?: PaymentStatus;   // Binario: PAID o PARTIAL
amountPaid: number;              // Solo saldo total
```

---

## 🔧 Recomendaciones de Arquitectura

### RECOMENDACIÓN 1: Agregar Jerarquía Parent-Children (Opcional - Fase 2)

**Objetivo:** Modelar relaciones 1-a-Muchos entre transacciones

```typescript
// En Transaction.entity.ts

@Column({ type: 'uuid', nullable: true })
parentTransactionId?: string;

@ManyToOne(() => Transaction, t => t.children)
@JoinColumn({ name: 'parentTransactionId' })
parent?: Transaction;

@OneToMany(() => Transaction, t => t.parent)
children?: Transaction[];
```

**Casos de Uso:**
- PAYROLL (padre) → múltiples PAYMENT_EXECUTION (hijos)
- SALE (padre) → múltiples PAYMENT_IN (hijos) para venta a plazo
- Anulaciones: SALE_ANNULMENT (hijo que referencia SALE como padre)

**Beneficios:**
- ✅ Consultas rápidas de "pagos asociados a esta venta"
- ✅ Auditoría completa de transacción y derivadas
- ✅ Reporte de conversión venta → cobranza

**Migración:** No requiere cambios a BD existente, cambio aditivo

---

### RECOMENDACIÓN 2: Crear Entidad `Installment` (Recomendado - Fase 2)

**Objetivo:** Control granular de cuotas sin modificar motor de transacciones

```typescript
@Entity('installments')
export class Installment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Referencias
  @Column({ type: 'uuid' })
  saleTransactionId!: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'saleTransactionId' })
  saleTransaction!: Transaction;

  // Datos de cuota
  @Column({ type: 'int' })
  installmentNumber!: number; // Cuota 1, 2, 3...

  @Column({ type: 'int' })
  totalInstallments!: number; // Total de cuotas: 3

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number; // Monto de la cuota

  @Column({ type: 'date' })
  dueDate!: Date; // Vencimiento: 30/03/2026

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amountPaid!: number; // Abonado a la cuota

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE'],
    default: 'PENDING'
  })
  status!: string;

  @Column({ type: 'uuid', nullable: true })
  paymentTransactionId?: string; // Referencia a PAYMENT_IN que la pagó

  @CreateDateColumn()
  createdAt!: Date;
}
```

**Migración:**
1. Crear tabla `installments`
2. API: Al crear SALE con 3+ cuotas, crear 3 registros en Installment
3. API: Al registrar PAYMENT_IN, buscar Installment vencida y marcar como PAID
4. Query de morosidad: `SELECT * FROM installments WHERE status IN ('PENDING', 'OVERDUE') AND dueDate < TODAY`

**Casos de Uso:**
- Venta $300,000 en 3 cuotas ($100,000 c/u)
- Cuota 1: 22/03/2026
- Cuota 2: 21/04/2026
- Cuota 3: 21/05/2026

**Beneficios:**
- ✅ Reporte de morosidad por cuota individual
- ✅ Estado de cobranza detallado
- ✅ Alertas de vencimiento próximo
- ✅ Análisis de días de atraso

---

### RECOMENDACIÓN 3: Crear Tipo `VOID_ADJUSTMENT` (Opcional - Fase 2)

**Objetivo:** Anulaciones trazables en lugar de solo cambiar status

```typescript
// En TransactionType enum, agregar:
VOID_ADJUSTMENT = 'VOID_ADJUSTMENT',

// Al anular una transacción, en lugar de:
transaction.status = TransactionStatus.CANCELLED;

// Crear nueva transacción:
{
  transactionType: TransactionType.VOID_ADJUSTMENT,
  relatedTransactionId: originalTransactionId,
  documentNumber: `VOID-${originalDocNumber}`,
  notes: 'Error en ingreso de monto',
  metadata: { reason: 'INCORRECT_AMOUNT', approvedBy: 'user123' }
}
```

**Beneficios:**
- ✅ Trazabilidad completa: qué se anuló, cuándo, por quién, por qué
- ✅ Auditoría contable: reversión explícita en asientos
- ✅ Reportes: anulaciones por motivo, por usuario, por período

---

## 📊 Matriz de Consistencia

| Tipo Trans. | Afecta Inventario | Afecta Caja | Afecta CxC | Afecta CxP | Requiere Líneas |
|------------|------------------|-----------|----------|----------|-----------------|
| SALE | ✅ Out | ✅ / ❌ | ✅ | ❌ | ✅ |
| SALE_RETURN | ✅ In | ✅ / ❌ | ✅ Reversa | ❌ | ✅ |
| PURCHASE | ✅ In | ✅ / ❌ | ❌ | ✅ | ✅ |
| PURCHASE_ORDER | ❌ | ❌ | ❌ | ❌ | ✅ |
| PURCHASE_RETURN | ✅ Out | ✅ / ❌ | ❌ | ✅ Reversa | ✅ |
| TRANSFER_OUT | ✅ Out | ❌ | ❌ | ❌ | ✅ |
| TRANSFER_IN | ✅ In | ❌ | ❌ | ❌ | ✅ |
| ADJUSTMENT_IN | ✅ In | ❌ | ❌ | ❌ | ✅ |
| ADJUSTMENT_OUT | ✅ Out | ❌ | ❌ | ❌ | ✅ |
| PAYMENT_IN | ❌ | ✅ In | ✅ | ❌ | ❌ |
| PAYMENT_OUT | ❌ | ✅ Out | ❌ | ❌ | ❌ |
| SUPPLIER_PAYMENT | ❌ | ✅ Out | ❌ | ✅ | ❌ |
| EXPENSE_PAYMENT | ❌ | ✅ Out | ❌ | ❌ | ❌ |
| PAYMENT_EXECUTION | ❌ | ✅ Out | ❌ | ✅ | ❌ |
| OPERATING_EXPENSE | ❌ | ✅ Out | ❌ | ❌ | ❌ |
| CASH_SESSION_OPENING | ❌ | ✅ In | ❌ | ❌ | ❌ |
| CASH_SESSION_CLOSING | ❌ | ❌ | ❌ | ❌ | ❌ |
| CASH_SESSION_WITHDRAWAL | ❌ | ✅ Out | ❌ | ❌ | ❌ |
| CASH_SESSION_DEPOSIT | ❌ | ✅ In | ❌ | ❌ | ❌ |
| PAYROLL | ❌ | ❌ | ❌ | ✅ | ✅ |
| CASH_DEPOSIT | ❌ | ✅ Out/In | ❌ | ❌ | ❌ |
| BANK_WITHDRAWAL_TO_SHAREHOLDER | ❌ | ✅ Out | ❌ | ❌ | ❌ |

---

## ✅ Fortalezas del Sistema Actual

1. **Diversidad de tipos:** 22 tipos cubren casos específicos del negocio
2. **Extensibilidad:** Campo `metadata` permite agregar datos sin modificar esquema
3. **Inmutabilidad:** Solo `createdAt`, sin `updatedAt` = trazabilidad garantizada
4. **Motor contable:** 16+ reglas automáticas de cálculo
5. **Integración:** Sesiones de caja, períodos contables, result centers
6. **Flexibilidad:** PaymentMethod soporta múltiples formas de pago

---

## ❌ Debilidades que Requieren Mejora

1. **Control de cuotas:** No hay granularidad para cartera a plazo
2. **Relaciones inversas:** relatedTransactionId sin @OneToMany
3. **Jerarquía:** No hay modelado de transacciones compuestas
4. **PAYMENT_OUT:** Tipo deprecado aún en uso
5. **Anulaciones:** Sin trazabilidad estructural (solo status VOIDED)
6. **Reportes:** Imposible generar morosidad por cuota, anulaciones por motivo

---

## 🎯 Roadmap de Mejoras

### Fase 1 (Actual) ✅
- [x] 22 tipos de transacciones funcionales
- [x] Motor contable con reglas automáticas
- [x] Integración con sesiones de caja

### Fase 2 (Próximo trimestre) 📋
- [ ] Deprecar PAYMENT_OUT (validar en API)
- [ ] Agregar @OneToMany inverso para relatedTransaction
- [ ] Crear entidad Installment
- [ ] Crear tipo VOID_ADJUSTMENT

### Fase 3 (Futuro) 💡
- [ ] Jerarquía parent-children
- [ ] Reportes de morosidad por cuota
- [ ] Dashboard de cartera por vencer
- [ ] Automatización de cobranza

---

## 📚 Documentos Relacionados

- [Transaction Entity](../backend/src/modules/transactions/domain/transaction.entity.ts)
- [Accounting Rules Engine](../backend/docs/accounting/ACCOUNTING_ENGINE.md)
- [API Implementation Guide](../API_IMPLEMENTATION_SUMMARY.md)

---

**Última actualización:** 22 de febrero de 2026  
**Responsable:** Arquitectura de Sistemas
