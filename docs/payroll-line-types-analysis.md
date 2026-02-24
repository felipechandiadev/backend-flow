# Análisis Completo: Tipos de Líneas de Nómina/Remuneración

**Fecha:** 22 de febrero de 2026  
**Sistema:** Flow Store - Módulo de Remuneraciones

---

## Resumen General

El sistema de remuneraciones maneja **30 tipos de líneas** diferentes, divididas en dos categorías:
- **19 Haberes (EARNINGS)** - Ingresos
- **11 Descuentos (DEDUCTIONS)** - Egresos

Todas estas líneas se incluyen dentro de una transacción de tipo `PAYROLL`.

---

## I. HABERES (EARNINGS) - 19 Tipos

Ingresos que se suman para calcular el bruto mensual.

### 1. ORDINARY
- **Nombre:** Remuneración ordinaria
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Sueldo base mensual del empleado
- **Uso:** Parte fija del salario

### 2. PROPORTIONAL
- **Nombre:** Remuneración proporcional
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Pago proporcional por servicios prestados
- **Uso:** Renuncia en medio de mes, ingreso a mitad de período

### 3. OVERTIME
- **Nombre:** Horas extraordinarias
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Pago por horas trabajadas fuera de jornada normal
- **Uso:** Sobrecarga laboral, urgencias
- **Cálculo:** Típicamente 50% más sobre la hora normal

### 4. BONUS
- **Nombre:** Bono
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Pago adicional por desempeño o objetivos
- **Uso:** Bonificaciones mensuales, trimestrales o anuales

### 5. ALLOWANCE
- **Nombre:** Asignación
- **Categoría:** EARNING
- **Imposable:** ❌ NO
- **Descripción:** Pago fijo por concepto específico (ej: colación, locomoción)
- **Uso:** Subsidios en dinero que la ley no grava
- **Ejemplos:** Asignación por locomoción, colación

### 6. GRATIFICATION
- **Nombre:** Gratificación
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Bono de fin de año
- **Uso:** Gratificación navideña, fin de año
- **Regulación:** Tipicamente 30% del salario o cantidad fija por convenio

### 7. VIATICUM
- **Nombre:** Viático
- **Categoría:** EARNING
- **Imposable:** ❌ NO
- **Descripción:** Dinero para gastos en desplazamientos
- **Uso:** Viajes de trabajo, traslados
- **Límites:** Generalmente no se grava si es razonable

### 8. REFUND
- **Nombre:** Reembolso de gastos
- **Categoría:** EARNING
- **Imposable:** ❌ NO
- **Descripción:** Devolución de dinero gastado por la empresa
- **Uso:** Adelantos, gastos reembolsables
- **Ejemplo:** Compra de útiles, gastos telefónicos

### 9. SUBSTITUTION
- **Nombre:** Suplencia o reemplazo
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Pago por ocupar temporarily cargo superior
- **Uso:** Reemplazo temporal de gerente, jefe, etc.
- **Cálculo:** Diferencia entre sueldo normal y cargo superior

### 10. INCENTIVE
- **Nombre:** Incentivo o desempeño
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Pago por cumplimiento de metas
- **Uso:** Bonificación por productividad, ventas
- **Variabilidad:** Mensual, según rendimiento

### 11. COMMISSION
- **Nombre:** Comisión
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Porcentaje sobre ventas o transacciones
- **Uso:** Vendedores, corredores
- **Cálculo:** Porcentaje sobre monto de ventas

### 12. ADJUSTMENT_POS
- **Nombre:** Ajuste o retroactivo (+)
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Corrección positiva de remuneración anterior
- **Uso:** Corrección de errores, cambio de salario retroactivo
- **Ejemplo:** Se aumentó sueldo en mes anterior, se ajusta ahora

### 13. FEES
- **Nombre:** Pago de honorarios
- **Categoría:** EARNING
- **Imposable:** ❌ NO
- **Descripción:** Honorarios profesionales
- **Uso:** Trabajadores independientes, consultores
- **Regulación:** Típicamente sin retención para ciertas profesiones

### 14. SETTLEMENT
- **Nombre:** Finiquito
- **Categoría:** EARNING
- **Imposable:** ❌ NO
- **Descripción:** Pago al término de relación laboral
- **Uso:** Despido, renuncia
- **Componentes:** Saldo de días, prestaciones, indemnizaciones

### 15. INDEMNITY
- **Nombre:** Indemnización
- **Categoría:** EARNING
- **Imposable:** ❌ NO
- **Descripción:** Compensación por despido injustificado
- **Uso:** Indemnización legal, acuerdos especiales
- **Regulación:** Libre de impuestos (hasta ciertos límites)

### 16. SPECIAL_SHIFT
- **Nombre:** Pago por turno especial
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Recargo por trabajo en horarios especiales
- **Uso:** Turnos compartidos, jornadas reducidas con recargo
- **Cálculo:** Porcentaje adicional sobre hora normal

### 17. HOLIDAY
- **Nombre:** Pago por trabajo en festivo
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Trabajo en días feriados o domingos
- **Uso:** Comercio, servicios, urgencias
- **Cálculo:** Típicamente 50% o 100% adicional

### 18. NIGHT_SHIFT
- **Nombre:** Pago por trabajo nocturno
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Recargo por trabajo en horas nocturnas
- **Uso:** Turnos nocturnos, 24/7
- **Regulación:** Según código laboral (típicamente 20-25% adicional)

### 19. EXCEPTIONAL
- **Nombre:** Pago excepcional o extraordinario
- **Categoría:** EARNING
- **Imposable:** ✅ SÍ
- **Descripción:** Pago único no recurrente
- **Uso:** Bonificaciones especiales, premios
- **Ejemplo:** Regalo por antigüedad, bonificación por cumpleaños empresarial

---

## II. DESCUENTOS (DEDUCTIONS) - 11 Tipos

Egresos que se restan del bruto para llegar al neto. Estos son los **tipos identificados en `DEDUCTION_TYPE_IDS`**:

### 1. AFP
- **Nombre:** AFP (Pensión)
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO (es retención)
- **Descripción:** Descuento obligatorio para fondo de pensiones
- **Uso:** Cotización obligatoria mensual
- **Tasa:** ~10% del salario imponible (varia según AFP)
- **Regulación:** Ley de Pensiones de Chile

### 2. HEALTH_INSURANCE
- **Nombre:** Seguro de Salud
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO (es retención)
- **Descripción:** Descuento para Fonasa o Isapre
- **Uso:** Cotización obligatoria de salud
- **Tasa:** 7% del salario imponible (para Fonasa)
- **Regulación:** Sistema de Salud Obligatorio

### 3. INCOME_TAX
- **Nombre:** Impuesto a la Renta
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO (es retención)
- **Descripción:** Retención del impuesto a la renta
- **Uso:** Tributación mensual
- **Tasa:** Progresiva según tramos (0% a 45%)
- **Regulación:** Código Tributario de Chile

### 4. UNEMPLOYMENT_INSURANCE
- **Nombre:** Seguro de Cesantía
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO (es retención)
- **Descripción:** Fondo de desempleo
- **Uso:** Cotización obligatoria
- **Tasa:** ~0.6% del salario (tasa actuales varían)
- **Regulación:** Ley de Seguro de Desempleo

### 5. LOAN_PAYMENT
- **Nombre:** Pago de Préstamo
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO
- **Descripción:** Cuota de préstamo otorgado por la empresa
- **Uso:** Préstamo para vivienda, educación, etc.
- **Acuerdo:** Se define parcialmente por contrato

### 6. ADVANCE_PAYMENT
- **Nombre:** Anticipo de Sueldo
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO
- **Descripción:** Descuento de anticipo recibido en período anterior
- **Uso:** Devolución de adelanto
- **Control:** Requiere registro de anticipos previos

### 7. UNION_FEE
- **Nombre:** Cuota Sindical
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO
- **Descripción:** Aporte obligatorio a sindicato
- **Uso:** Affiliation sindical
- **Tasa:** Variable según sindicato (típicamente 1-3%)
- **Obligatoriedad:** Voluntaria pero obligatoria si está afiliado

### 8. COURT_ORDER
- **Nombre:** Descuento Judicial
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO
- **Descripción:** Descuento por orden judicial
- **Uso:** Embargo por alimentos, deudas contraídas
- **Regulación:** Se cumple por orden de tribunal

### 9. DEDUCTION_EXTRA
- **Nombre:** Descuento extraordinario
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO
- **Descripción:** Descuento no recurrente
- **Uso:** Descuentos especiales, disciplinarios
- **Requisitos:** Debe tener justificación y consentimiento

### 10. ADJUSTMENT_NEG
- **Nombre:** Ajuste o retroactivo (-)
- **Categoría:** DEDUCTION
- **Imposable:** ❌ NO
- **Descripción:** Corrección negativa (descuento de corrección anterior)
- **Uso:** Ajuste de error en mes anterior
- **Ejemplo:** Se pagó demás, se descuenta ahora

---

## III. Detalles Técnicos

### Estructura en Backend

```typescript
// /backend/src/modules/remunerations/application/remunerations.service.ts
const DEDUCTION_TYPE_IDS = new Set([
  'AFP',
  'HEALTH_INSURANCE',
  'INCOME_TAX',
  'UNEMPLOYMENT_INSURANCE',
  'LOAN_PAYMENT',
  'ADVANCE_PAYMENT',
  'UNION_FEE',
  'COURT_ORDER',
  'DEDUCTION_EXTRA',
  'ADJUSTMENT_NEG',
]);
```

### Cálculo de Nómina

```typescript
// Dentro de createRemuneration():
const { totalEarnings, totalDeductions, netPayment, normalizedLines } 
  = this.calculateTotals(data.lines);

// totalEarnings = suma de todos los EARNINGS
// totalDeductions = suma de todos los DEDUCTIONS  
// netPayment = totalEarnings - totalDeductions
```

### Almacenamiento en Transacciones

```typescript
// Se crea una transacción de tipo PAYROLL con:
{
  type: 'PAYROLL',
  employeeId: '...',
  subtotal: totalEarnings,
  taxAmount: 0,
  discountAmount: totalDeductions,
  total: netPayment,
  
  metadata: {
    remuneration: true,
    payrollDate: date,
    lines: normalizedLines,  // ← Array de líneas con typeId y amount
    totalEarnings,
    totalDeductions,
    netPayment
  }
}
```

### Línea Individual

Cada línea contiene:
```typescript
interface RemunerationLineInput {
  typeId: string;      // ORDINARY, OVERTIME, AFP, etc.
  amount: number;      // Monto en pesos
}
```

---

## IV. Integración Contable

### Metadata en PAYMENT_EXECUTION

Cuando se ejecuta el pago de nómina, se crea una transacción `PAYMENT_EXECUTION` con:

```typescript
metadata: {
  payrollLineType: 'AFP',           // ← Tipo específico de línea
  payrollTransactionId: 'payroll-123',
  origin: 'PAYMENT_COMPLETION'
}
```

Esto permite que el **motor contable** genere asientos separados para:
- Cuentas por Pagar AFP
- Cuentas por Pagar Fonasa
- Cuentas por Pagar Impuestos
- Cuentas por Pagar Neto al Empleado

---

## V. Ejemplo Completo: Nómina de María

### Datos de María
- Sueldo base: $650.000
- Horas extraordinarias: 50.000
- Bono: 100.000

### Líneas de Haberes
```json
[
  { "typeId": "ORDINARY", "amount": 650000 },
  { "typeId": "OVERTIME", "amount": 50000 },
  { "typeId": "BONUS", "amount": 100000 }
]
```

**Total Haberes: $800.000**

### Líneas de Descuentos
```json
[
  { "typeId": "AFP", "amount": 80000 },
  { "typeId": "HEALTH_INSURANCE", "amount": 56000 },
  { "typeId": "INCOME_TAX", "amount": 44000 },
  { "typeId": "UNEMPLOYMENT_INSURANCE", "amount": 4800 }
]
```

**Total Descuentos: $184.800**

### Neto
```
$800.000 - $184.800 = $615.200
```

### Transacción PAYROLL Generada
```json
{
  "type": "PAYROLL",
  "employeeId": "maria-123",
  "subtotal": 800000,
  "discountAmount": 184800,
  "total": 615200,
  "metadata": {
    "remuneration": true,
    "lines": [
      { "typeId": "ORDINARY", "amount": 650000, "category": "EARNING" },
      { "typeId": "OVERTIME", "amount": 50000, "category": "EARNING" },
      { "typeId": "BONUS", "amount": 100000, "category": "EARNING" },
      { "typeId": "AFP", "amount": 80000, "category": "DEDUCTION" },
      { "typeId": "HEALTH_INSURANCE", "amount": 56000, "category": "DEDUCTION" },
      { "typeId": "INCOME_TAX", "amount": 44000, "category": "DEDUCTION" },
      { "typeId": "UNEMPLOYMENT_INSURANCE", "amount": 4800, "category": "DEDUCTION" }
    ],
    "totalEarnings": 800000,
    "totalDeductions": 184800,
    "netPayment": 615200
  }
}
```

---

## VI. Estado Actual y Gaps

### ✅ Implementado
- 19 tipos de haberes
- 11 tipos de descuentos
- Cálculo automático de totales
- Integración con transacciones
- Relación con empleados

### ❌ No Implementado (Recommendations)
- [ ] Tabla de **rates** por tipo (AFP 10%, Fonasa 7%, etc.)
- [ ] Validación de **límites tributarios** (UF, montos máximos)
- [ ] Prorrateo de **gratificación** a lo largo del año
- [ ] Cálculo automático de **impuesto a la renta**
- [ ] **Acumulados** (YTD) por empleado
- [ ] Generación automática de **F29** (Declaración de remuneraciones)
- [ ] Soporte para **dietas** de directivos

---

## VII. Conclusión

El sistema de remuneraciones soporta una **estructura completa** de 30 tipos de líneas:
- Flexible para diversos tipos de ingreso
- Integración directa con contabilidad
- Cálculo automático de netos
- Trazabilidad en transacciones PAYROLL

Está **listo para producción** en empresas pequeñas y medianas, pero requiere **extensiones** para cumplimiento tributario avanzado (F29, acumulados, etc.).
