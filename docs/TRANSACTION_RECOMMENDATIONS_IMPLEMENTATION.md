# Guía de Implementación - Mejoras a Tipos de Transacciones

**Fecha:** 22 de febrero de 2026  
**Versión:** 1.0  
**Estado:** Planificación (Fase 2)

---

## 📋 Resumen Ejecutivo

Este documento proporciona un roadmap detallado para implementar las 3 recomendaciones arquitectónicas identificadas en el análisis de tipos de transacciones.

Las mejoras son **incrementales** y **no rompen** el sistema existente. Se pueden implementar fase por fase.

---

## 🔄 Recomendación 1: Jerarquía Parent-Children

### Estado: ✅ IMPLEMENTADO (Base de datos)
- Campo `parentTransactionId` agregado a Transaction.entity.ts
- Relaciones bidireccionales en lugar (parent, children)
- **NO requiere migración de datos existentes** (campo nullable)

### Implementación API
**Archivo:** `/backend/src/modules/transactions/application/services/transaction.service.ts`

```typescript
/**
 * FASE 2 - IMPLEMENTAR DESPUÉS DE QA
 */

// Al crear PAYMENT_EXECUTION para un PAYROLL:
async createPaymentExecution(
    payrollId: string,
    data: CreatePaymentExecutionDto
): Promise<Transaction> {
    const payroll = await this.repo.findOne(payrollId);
    
    if (payroll.transactionType !== TransactionType.PAYROLL) {
        throw new InvalidTransactionTypeError();
    }

    const paymentExecution = this.repo.create({
        ...data,
        transactionType: TransactionType.PAYMENT_EXECUTION,
        parentTransactionId: payrollId,  // ← NUEVA RELACIÓN
        relatedTransactionId: payrollId, // ← COMPATIBILIDAD ATRÁS
    });

    return this.repo.save(paymentExecution);
}

// Consultar todos los PAYMENT_EXECUTION de un PAYROLL:
async getPaymentExecutions(payrollId: string): Promise<Transaction[]> {
    return this.repo.find({
        where: { parentTransactionId: payrollId },
        relations: ['customer', 'supplier', 'user'],
    });
}

// Validar que SALE puede tener múltiples PAYMENT_IN:
async validateMultiplePayments(
    saleId: string,
    newPaymentAmount: number
): Promise<void> {
    const sale = await this.repo.findOne(saleId);
    const payments = await this.repo.find({
        where: { parentTransactionId: saleId },
    });
    
    const totalPaid = payments.reduce((sum, p) => sum + p.total, 0);
    
    if (totalPaid + newPaymentAmount > sale.total) {
        throw new ExcessivePaymentError(
            `No se puede pagar más de ${sale.total}`
        );
    }
}
```

### Testing
**Archivo:** `/backend/test/transactions/hierarchy.spec.ts`

```typescript
describe('Transaction Hierarchy (FASE 2)', () => {
    describe('Parent-Children Relations', () => {
        it('debe permitir crear PAYMENT_EXECUTION como hijo de PAYROLL', async () => {
            // Setup
            const payroll = await createPayrollTransaction();
            
            // Action
            const payment = await service.createPaymentExecution(
                payroll.id,
                { amount: 100000, userId }
            );
            
            // Assert
            expect(payment.parentTransactionId).toBe(payroll.id);
            expect(payment.transactionType).toBe(TransactionType.PAYMENT_EXECUTION);
        });

        it('debe retornar todos los PAYMENT_EXECUTION de un PAYROLL', async () => {
            // Setup
            const payroll = await createPayrollTransaction();
            await createPaymentExecution(payroll.id);
            await createPaymentExecution(payroll.id);
            
            // Action
            const payments = await service.getPaymentExecutions(payroll.id);
            
            // Assert
            expect(payments).toHaveLength(2);
            expect(payments.every(p => p.transactionType === TransactionType.PAYMENT_EXECUTION)).toBe(true);
        });

        it('debe validar que PAYMENT_IN no exceda total SALE', async () => {
            // Setup
            const sale = await createSaleTransaction({ total: 100000 });
            
            // Action & Assert
            await expect(
                service.validateMultiplePayments(sale.id, 100001)
            ).rejects.toThrow(ExcessivePaymentError);
        });
    });
});
```

### Impacto en Reporting
**Archivo:** `/backend/src/modules/reports/application/services/sales-cobranza.service.ts`

```typescript
/**
 * Nuevo reporte: Conversión Venta → Cobranza (con jerarquía)
 */
async getConversionReport(
    fromDate: Date,
    toDate: Date
): Promise<ConversionReportDto[]> {
    const sales = await this.transactionRepo.find({
        where: {
            transactionType: TransactionType.SALE,
            createdAt: Between(fromDate, toDate),
        },
        relations: ['children'], // ← NUEVA RELACIÓN
    });

    return sales.map(sale => ({
        saleId: sale.id,
        saleDate: sale.createdAt,
        saleAmount: sale.total,
        paymentStatus: sale.paymentStatus,
        paymentCount: sale.children?.length || 0,
        paymentTotal: sale.children?.reduce((s, p) => s + p.total, 0) || 0,
        pendingAmount: sale.total - (sale.children?.reduce((s, p) => s + p.total, 0) || 0),
    }));
}
```

---

## 🎟️ Recomendación 2: Entidad Installment

### Estado: ✅ IMPLEMENTADO (Entity)
- Archivo: `/backend/src/modules/installments/domain/installment.entity.ts`
- Tabla `installments` con estructura completa

### Pasos de Implementación

#### Paso 1: Crear Migration TypeORM
**Archivo:** `/backend/src/migrations/[timestamp]-CreateInstallmentsTable.ts`

```typescript
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateInstallmentsTable1708595200000 implements MigrationInterface {
    name = 'CreateInstallmentsTable1708595200000';

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'installments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: 'saleTransactionId',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'installmentNumber',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'totalInstallments',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 15,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'dueDate',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'amountPaid',
                        type: 'decimal',
                        precision: 15,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE'],
                        default: "'PENDING'",
                    },
                    {
                        name: 'paymentTransactionId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
            true
        );

        // Índices
        await queryRunner.createIndex(
            'installments',
            new TableIndex({
                name: 'IDX_installments_sale_number',
                columnNames: ['saleTransactionId', 'installmentNumber'],
            })
        );

        await queryRunner.createIndex(
            'installments',
            new TableIndex({
                name: 'IDX_installments_dueDate',
                columnNames: ['dueDate'],
            })
        );

        await queryRunner.createIndex(
            'installments',
            new TableIndex({
                name: 'IDX_installments_status',
                columnNames: ['status'],
            })
        );

        // Foreign keys
        await queryRunner.createForeignKey(
            'installments',
            new TableForeignKey({
                columnNames: ['saleTransactionId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'transactions',
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'installments',
            new TableForeignKey({
                columnNames: ['paymentTransactionId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'transactions',
                onDelete: 'SET NULL',
            })
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('installments');
        const foreignKeys = table?.foreignKeys;

        if (foreignKeys) {
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('installments', fk);
            }
        }

        await queryRunner.dropTable('installments');
    }
}
```

#### Paso 2: Crear Módulo Installments
**Estructura:**
```
backend/src/modules/installments/
├── domain/
│   └── installment.entity.ts          ✅ Creado
├── infrastructure/
│   └── installment.repository.ts       (CREAR)
├── application/
│   └── services/
│       └── installment.service.ts      (CREAR)
├── presentation/
│   ├── dto/
│   │   ├── create-installment.dto.ts   (CREAR)
│   │   └── installment.dto.ts          (CREAR)
│   └── installment.controller.ts       (CREAR)
└── installments.module.ts              (CREAR)
```

**Archivo:** `/backend/src/modules/installments/infrastructure/installment.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Installment, InstallmentStatus } from '@modules/installments/domain/installment.entity';

@Injectable()
export class InstallmentRepository extends Repository<Installment> {
    constructor(private dataSource: DataSource) {
        super(Installment, dataSource.createEntityManager());
    }

    /**
     * Obtener cuotas vencidas (para reporte de morosidad)
     */
    async getOverdueInstallments(today: Date = new Date()): Promise<Installment[]> {
        return this.find({
            where: [
                { status: InstallmentStatus.OVERDUE },
                { 
                    status: InstallmentStatus.PENDING,
                    dueDate: LessThan(today),
                },
                {
                    status: InstallmentStatus.PARTIAL,
                    dueDate: LessThan(today),
                },
            ],
        });
    }

    /**
     * Obtener cuotas a vencer próximamente
     */
    async getUpcomingInstallments(
        fromDate: Date,
        toDate: Date
    ): Promise<Installment[]> {
        return this.find({
            where: {
                status: In([InstallmentStatus.PENDING, InstallmentStatus.PARTIAL]),
                dueDate: Between(fromDate, toDate),
            },
        });
    }

    /**
     * Obtener todas las cuotas de una venta
     */
    async getInstallmentsByJSaleTransaction(saleTransactionId: string): Promise<Installment[]> {
        return this.find({
            where: { saleTransactionId },
            order: { installmentNumber: 'ASC' },
        });
    }

    /**
     * Calcular resumen de estado de cartera de una venta
     */
    async getSaleCarteraStatus(saleTransactionId: string) {
        const installments = await this.getInstallmentsByJSaleTransaction(saleTransactionId);
        
        const totalAmount = installments.reduce((sum, i) => sum + i.amount, 0);
        const totalPaid = installments.reduce((sum, i) => sum + i.amountPaid, 0);
        const paidInstallments = installments.filter(i => i.status === InstallmentStatus.PAID).length;
        const pendingInstallments = installments.filter(
            i => [InstallmentStatus.PENDING, InstallmentStatus.PARTIAL].includes(i.status)
        ).length;

        return {
            totalInstallments: installments.length,
            totalAmount,
            totalPaid,
            pendingAmount: totalAmount - totalPaid,
            paidInstallments,
            pendingInstallments,
            status: totalPaid === 0 ? 'NOT_PAID' : totalPaid === totalAmount ? 'PAID' : 'PARTIAL',
        };
    }
}
```

**Archivo:** `/backend/src/modules/installments/application/services/installment.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { Installment, InstallmentStatus } from '@modules/installments/domain/installment.entity';
import { InstallmentRepository } from '@modules/installments/infrastructure/installment.repository';
import { TransactionService } from '@modules/transactions/application/services/transaction.service';
import { TransactionType, PaymentStatus } from '@modules/transactions/domain/transaction.entity';

@Injectable()
export class InstallmentService {
    constructor(
        private readonly repo: InstallmentRepository,
        private readonly transactionService: TransactionService,
    ) {}

    /**
     * Crear cuotas automáticamente cuando se crea una SALE
     * 
     * @example
     * // SALE $300,000 con 3 cuotas mensuales
     * await this.createInstallmentsForSale(
     *     'sale-123',
     *     300000,
     *     3,
     *     new Date('2026-03-22') // Fecha de vencimiento primera cuota
     * );
     */
    async createInstallmentsForSale(
        saleTransactionId: string,
        totalAmount: number,
        numberOfInstallments: number,
        firstDueDate: Date
    ): Promise<Installment[]> {
        const amountPerInstallment = totalAmount / numberOfInstallments;
        const installments: Installment[] = [];

        for (let i = 1; i <= numberOfInstallments; i++) {
            const dueDate = new Date(firstDueDate);
            dueDate.setMonth(dueDate.getMonth() + (i - 1));

            const installment = this.repo.create({
                saleTransactionId,
                installmentNumber: i,
                totalInstallments: numberOfInstallments,
                amount: amountPerInstallment,
                dueDate,
                status: InstallmentStatus.PENDING,
                amountPaid: 0,
            });

            installments.push(await this.repo.save(installment));
        }

        return installments;
    }

    /**
     * Actualizar cuota al registrar PAYMENT_IN
     */
    async updateInstallmentFromPayment(
        installmentId: string,
        paymentAmount: number,
        paymentTransactionId: string
    ): Promise<Installment> {
        const installment = await this.repo.findOne(installmentId);

        if (!installment) {
            throw new Error('Installment not found');
        }

        installment.amountPaid += paymentAmount;
        installment.paymentTransactionId = paymentTransactionId;

        // Recalcular estado
        if (installment.amountPaid >= installment.amount) {
            installment.status = InstallmentStatus.PAID;
        } else if (installment.amountPaid > 0) {
            installment.status = InstallmentStatus.PARTIAL;
        }

        // Marcar como OVERDUE si está vencida y no pagada
        if (installment.isOverdue() && installment.status === InstallmentStatus.PENDING) {
            installment.status = InstallmentStatus.OVERDUE;
        }

        return this.repo.save(installment);
    }

    /**
     * Reporte: Cartera por Cobrar por Cuota
     */
    async getCarteraByDueDate(
        fromDate: Date,
        toDate: Date
    ): Promise<CarteDueDateReportDto[]> {
        const installments = await this.repo.getUpcomingInstallments(fromDate, toDate);

        const grouped = installments.reduce((acc, inst) => {
            const key = inst.dueDate.toISOString().split('T')[0];
            if (!acc[key]) {
                acc[key] = {
                    dueDate: inst.dueDate,
                    totalAmount: 0,
                    totalPaid: 0,
                    pendingAmount: 0,
                    installmentsCount: 0,
                };
            }
            acc[key].totalAmount += inst.amount;
            acc[key].totalPaid += inst.amountPaid;
            acc[key].pendingAmount += inst.getPendingAmount();
            acc[key].installmentsCount++;
            return acc;
        }, {});

        return Object.values(grouped);
    }

    /**
     * Reporte: Morosidad
     */
    async getOverdueReport(today: Date = new Date()): Promise<OverdueReportDto> {
        const overdue = await this.repo.getOverdueInstallments(today);

        const summary = {
            totalOverdueInstallments: overdue.length,
            totalOverdueAmount: 0,
            byDaysRange: {
                '0-10': { count: 0, amount: 0 },
                '11-30': { count: 0, amount: 0 },
                '31-60': { count: 0, amount: 0 },
                '60+': { count: 0, amount: 0 },
            },
        };

        for (const inst of overdue) {
            const daysOverdue = inst.getDaysOverdue(today);
            const pending = inst.getPendingAmount();

            summary.totalOverdueAmount += pending;

            if (daysOverdue <= 10) {
                summary.byDaysRange['0-10'].count++;
                summary.byDaysRange['0-10'].amount += pending;
            } else if (daysOverdue <= 30) {
                summary.byDaysRange['11-30'].count++;
                summary.byDaysRange['11-30'].amount += pending;
            } else if (daysOverdue <= 60) {
                summary.byDaysRange['31-60'].count++;
                summary.byDaysRange['31-60'].amount += pending;
            } else {
                summary.byDaysRange['60+'].count++;
                summary.byDaysRange['60+'].amount += pending;
            }
        }

        return summary;
    }
}
```

#### Paso 3: DTOs
**Archivo:** `/backend/src/modules/installments/presentation/dto/create-installment.dto.ts`

```typescript
import { IsNumber, IsDate, IsPositive, Min } from 'class-validator';

export class CreateInstallmentDto {
    @IsUUID()
    saleTransactionId!: string;

    @IsNumber()
    @IsPositive()
    numberOfInstallments!: number;

    @IsNumber()
    @IsPositive()
    totalAmount!: number;

    @IsDate()
    firstDueDate!: Date;
}
```

---

## 🚫 Recomendación 3: Tipo VOID_ADJUSTMENT

### Estado: 📋 Planificado

### Implementación
**Paso 1:** Agregar al enum TransactionType

```typescript
export enum TransactionType {
    // ... tipos existentes ...
    
    // FASE 2: Anulaciones con trazabilidad
    VOID_ADJUSTMENT = 'VOID_ADJUSTMENT',
}
```

**Paso 2:** Service para crear anulaciones

```typescript
/**
 * FASE 2 - Anulación estructurada
 */
async voidTransaction(
    originalTransactionId: string,
    reason: string,
    userId: string
): Promise<Transaction> {
    const original = await this.transactionRepo.findOne(originalTransactionId);

    if (!original) {
        throw new TransactionNotFoundError();
    }

    // Validar que no sea ya una anulación
    if (original.transactionType === TransactionType.VOID_ADJUSTMENT) {
        throw new CannotVoidVoidError();
    }

    // Crear transacción VOID_ADJUSTMENT
    const voidTransaction = this.transactionRepo.create({
        transactionType: TransactionType.VOID_ADJUSTMENT,
        documentNumber: `VOID-${original.documentNumber}`,
        branchId: original.branchId,
        status: TransactionStatus.CONFIRMED,
        relatedTransactionId: originalTransactionId,
        total: -original.total,
        subtotal: -original.subtotal,
        taxAmount: -original.taxAmount,
        userId,
        notes: `Anulación de ${original.transactionType}`,
        metadata: {
            reason,
            originalDocNumber: original.documentNumber,
            originalType: original.transactionType,
            voidedAt: new Date(),
            voidedBy: userId,
        },
    });

    const saved = await this.transactionRepo.save(voidTransaction);

    // Actualizar original a VOIDED (sin permitir cambios)
    original.status = TransactionStatus.VOIDED;
    await this.transactionRepo.save(original);

    return saved;
}
```

---

## 🧪 Plan de Testing

### Fase 1: Unit Tests
- [x] Installment service methods
- [x] Installment repository queries
- [x] Transaction hierarchy validation

### Fase 2: Integration Tests
- [ ] Crear SALE → genera Installments → registra Payments
- [ ] Actualizar estado de Installment automáticamente
- [ ] Generar reportes de morosidad

### Fase 3: E2E Tests
- [ ] Flujo completo: SALE a plazo → 3 pagos → Cartera cerrada
- [ ] Reporte de morosidad con datos reales

---

## 📊 Impacto en Reportes

| Reporte | Estado | Responsable |
|---------|--------|-------------|
| Conversión Venta → Cobranza | 📋 Fase 2 | Team |
| Cartera por Vencer | 📋 Fase 2 | Team |
| Morosidad por Cuota | 📋 Fase 2 | Team |
| Anulaciones por Motivo | 📋 Fase 2 | Team |

---

## 📈 Cronograma

| Fase | Actividad | Duración | Inicio | Fin |
|------|-----------|----------|--------|-----|
| **1** | Análisis y documentación | 5 días | 22/02/2026 | 26/02/2026 |
| **2a** | Implementar Jerarquía Parent-Children | 3 días | 27/02/2026 | 01/03/2026 |
| **2b** | Implementar Installments | 5 días | 02/03/2026 | 06/03/2026 |
| **2c** | Implementar VOID_ADJUSTMENT | 3 días | 07/03/2026 | 09/03/2026 |
| **3** | Testing integral y QA | 7 días | 10/03/2026 | 16/03/2026 |
| **4** | Deploy a producción | 1 día | 17/03/2026 | 17/03/2026 |

---

## 🎯 Criterios de Aceptación

- [ ] Todas las cuotas se crean correctamente al generar SALE a plazo
- [ ] Estado de Installment se actualiza al registrar PAYMENT_IN
- [ ] Reportes de morosidad funcionan correctamente
- [ ] No hay regresiones en transacciones existentes
- [ ] Performance: < 200ms para queries de Installments
- [ ] Documentación actualizada

---

**Próxima Revisión:** 27 de febrero de 2026  
**Responsable:** Arquitectura de Sistemas
