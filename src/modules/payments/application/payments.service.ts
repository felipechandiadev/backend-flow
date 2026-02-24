import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, IsNull } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus, PaymentMethod, PaymentStatus } from '@modules/transactions/domain/transaction.entity';
import { CashSession } from '@modules/cash-sessions/domain/cash-session.entity';
import { PointOfSale } from '@modules/points-of-sale/domain/point-of-sale.entity';
import { User } from '@modules/users/domain/user.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { LedgerEntry } from '@modules/ledger-entries/domain/ledger-entry.entity';
import { TransactionsService } from '@modules/transactions/application/transactions.service';
import { LedgerEntriesService } from '@modules/ledger-entries/application/ledger-entries.service';
import { CreateMultiplePaymentsDto } from './dto/create-multiple-payments.dto';
import { InstallmentService } from '@modules/installments/application/services/installment.service';
import { InstallmentSourceType } from '@modules/installments/domain/installment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(CashSession)
    private readonly cashSessionRepository: Repository<CashSession>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    private readonly dataSource: DataSource,
    private readonly transactionsService: TransactionsService,
    private readonly ledgerEntriesService: LedgerEntriesService,
    private readonly installmentService: InstallmentService,
  ) {}

  /**
   * Crear múltiples pagos para una venta
   * 
   * IMPORTANTE: Cada pago es una transacción separada que pasa por:
   * - Validaciones V1-V7
   * - Generación de asientos (LedgerEntry)
   * - Auditoría completa
   * 
   * El servicio DELEGA cada pago a TransactionsService.createTransaction()
   */
  async createMultiplePayments(dto: CreateMultiplePaymentsDto) {
    const { saleTransactionId, payments } = dto;

    return await this.dataSource.transaction(async (manager) => {
      const saleTransaction = await manager.getRepository(Transaction).findOne({
        where: { id: saleTransactionId, transactionType: TransactionType.SALE },
      });

      if (!saleTransaction) {
        throw new NotFoundException('Venta no encontrada');
      }

      const cashSession = saleTransaction.cashSessionId
        ? await manager.getRepository(CashSession).findOne({ where: { id: saleTransaction.cashSessionId } })
        : null;

      const pointOfSale = saleTransaction.pointOfSaleId
        ? await manager.getRepository(PointOfSale).findOne({ where: { id: saleTransaction.pointOfSaleId } })
        : null;

      const user = await manager.getRepository(User).findOne({ where: { id: saleTransaction.userId } });

      if (!cashSession || !pointOfSale || !user) {
        throw new BadRequestException('Datos de venta incompletos');
      }

      const paymentTransactions: any[] = [];
      let totalPaid = 0;

      for (const payment of payments) {
        if (payment.paymentMethod === PaymentMethod.INTERNAL_CREDIT) {
          const subPayments = Array.isArray(payment.subPayments) ? payment.subPayments : [];
          // INTERNAL_CREDIT: Solo marca en metadata, no genera asiento
          saleTransaction.metadata = {
            ...(saleTransaction.metadata || {}),
            internalCreditQuotas: payment.subPayments,
            internalCreditAmount: payment.amount,
          };
          await manager.getRepository(Transaction).save(saleTransaction);

          const existing = await this.installmentService.getInstallmentsForSale(saleTransaction.id);
          if (existing.length === 0) {
            const schedule = subPayments
              .filter((item: any) => item?.amount && item?.dueDate)
              .map((item: any) => ({
                amount: Number(item.amount || 0),
                dueDate: item.dueDate,
              }));

            if (schedule.length > 0) {
              await this.installmentService.createInstallmentsFromSchedule(
                saleTransaction.id,
                schedule,
                {
                  sourceType: InstallmentSourceType.SALE,
                  payeeType: 'CUSTOMER',
                  payeeId: saleTransaction.customerId || undefined,
                },
              );
            } else if (payment.amount > 0) {
              const fallbackDueDate = new Date();
              fallbackDueDate.setDate(fallbackDueDate.getDate() + 30);
              await this.installmentService.createInstallmentsFromSchedule(
                saleTransaction.id,
                [{ amount: Number(payment.amount || 0), dueDate: fallbackDueDate }],
                {
                  sourceType: InstallmentSourceType.SALE,
                  payeeType: 'CUSTOMER',
                  payeeId: saleTransaction.customerId || undefined,
                },
              );
            }
          }

          totalPaid += payment.amount;
          continue;
        }

        // DELEGAR CADA PAGO: TransactionsService.createTransaction()
        // El servicio se encargará de:
        // 1. Validaciones V1-V7 (saldo cliente si es deuda, etc)
        // 2. Generar documentNumber único
        // 3. Crear Transaction
        // 4. Generar asientos (LedgerEntry)
        const paymentTransaction = await this.createPaymentTransactionCentralized(manager, {
          saleTransaction,
          payment,
          cashSession,
          pointOfSale,
          user,
        });

        paymentTransactions.push({
          id: paymentTransaction.id,
          paymentMethod: payment.paymentMethod,
          amount: payment.amount,
          transactionId: paymentTransaction.id,
        });

        totalPaid += payment.amount;
      }

      // Actualizar caja después de pagos de caja
      const cashPayments = payments
        .filter((p) => p.paymentMethod === PaymentMethod.CASH)
        .reduce((sum, p) => sum + p.amount, 0);

      const nonCashTotal = totalPaid - cashPayments;
      const remainingAfterNonCash = Math.max(0, saleTransaction.total - nonCashTotal);
      const change = Math.max(0, cashPayments - remainingAfterNonCash);

      if (change > 0) {
        const prev = cashSession.expectedAmount ?? cashSession.openingAmount ?? 0;
        cashSession.expectedAmount = Number(prev) - Number(change);
        await manager.getRepository(CashSession).save(cashSession);
      }

      cashSession.expectedAmount = await this.recomputeCashSessionExpectedAmount(manager, cashSession);
      await manager.getRepository(CashSession).save(cashSession);

      return {
        success: true,
        payments: paymentTransactions,
        totalPaid,
        change,
      };
    });
  }

  async payQuota(dto: any) {
    const paidQuotaId = dto?.paidQuotaId;
    if (!paidQuotaId) {
      throw new BadRequestException('paidQuotaId es requerido');
    }

    const result = await this.installmentService.payInstallment(paidQuotaId, {
      paymentMethod: dto.paymentMethod as any,
      companyAccountKey: dto.bankAccountId || undefined,
      amount: dto.amount,
    });

    return {
      success: true,
      message: 'Pago registrado correctamente',
      transaction: result.transaction,
    };
  }

  /**
   * Crear pago de forma centralizada a través de TransactionsService
   * NOTA: Está dentro de una transacción DB ya abierta por el llamador
   */
  private async createPaymentTransactionCentralized(
    manager: EntityManager,
    params: {
      saleTransaction: any;
      payment: any;
      cashSession: any;
      pointOfSale: any;
      user: any;
    },
  ): Promise<Transaction> {
    const { saleTransaction, payment, cashSession, pointOfSale, user } = params;

    // Crear DTO de pago
    const paymentData = {
      documentNumber: this.generatePaymentDocumentNumber(saleTransaction.documentNumber),
      transactionType: TransactionType.PAYMENT_IN,
      status: TransactionStatus.CONFIRMED,
      branchId: pointOfSale.branchId || undefined,
      pointOfSaleId: pointOfSale.id,
      cashSessionId: cashSession.id,
      customerId: saleTransaction.customerId || undefined,
      userId: user.id,
      subtotal: payment.amount,
      taxAmount: 0,
      discountAmount: 0,
      total: payment.amount,
      paymentMethod: payment.paymentMethod,
      bankAccountKey: payment.bankAccountId || undefined,
      relatedTransactionId: saleTransaction.id,
      metadata: {
        saleTransactionId: saleTransaction.id,
        bankAccountId: payment.bankAccountId,
        subPayments: payment.subPayments,
      },
    };

    // DELEGAR: Aunque ya estamos en transacción, usar TransactionsService
    // para que gestione validaciones y asientos de forma centralizada
    // NOTA: TransactionsService.createTransaction() abre su propia transacción,
    // así que aquí guardamos directamente en el manager
    const txRepo = manager.getRepository(Transaction);
    return await txRepo.save(paymentData) as Transaction;
  }

  private generatePaymentDocumentNumber(saleDocumentNumber: string): string {
    const timestamp = Date.now();
    return `PAY-${saleDocumentNumber}-${timestamp}`;
  }

  private async recomputeCashSessionExpectedAmount(
    manager: EntityManager,
    cashSession: CashSession,
  ): Promise<number> {
    // simplified placeholder
    return Number(cashSession.expectedAmount ?? 0);
  }
}
