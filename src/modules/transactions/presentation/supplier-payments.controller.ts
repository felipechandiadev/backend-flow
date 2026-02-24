import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { TransactionsService } from '../application/transactions.service';
import { TransactionType, TransactionStatus } from '../domain/transaction.entity';

/**
 * Controller para pagos a proveedores (wrapper sobre TransactionsService)
 * Filtra automáticamente transacciones de tipo PAYMENT_OUT con supplierId
 */
@Controller('supplier-payments')
export class SupplierPaymentsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * GET /api/supplier-payments?limit=100&includeCancelled=false&includePaid=false
   * Lista pagos a proveedores (transacciones PAYMENT_OUT)
   * 
   * Retorna formato compatible con DataGrid:
   * {
   *   rows: Transaction[],
   *   total: number,
   *   page: number,
   *   pageSize: number
   * }
   */
  @Get()
  async list(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('includeCancelled') includeCancelled?: string,
    @Query('includePaid') includePaid?: string,
    @Query('supplierId') supplierId?: string,
  ) {
    const limitNum = parseInt(limit || '100', 10);
    const pageNum = parseInt(page || '1', 10);

    // Construir query params para transacciones de tipo PAYMENT_OUT
    const searchDto: any = {
      page: pageNum,
      limit: limitNum,
      type: TransactionType.PAYMENT_OUT,
    };

    // Filtrar por supplierId si se proporciona
    // TODO: Agregar soporte para supplierId en TransactionsService
    // if (supplierId) {
    //   searchDto.supplierId = supplierId;
    // }

    // Excluir canceladas si includeCancelled=false
    if (includeCancelled === 'false') {
      // Agregar filtro para excluir canceladas
      // TODO: Implementar statusNot en TransactionsService
    }

    // Filtrar solo borradores si includePaid=false (pagos aún no confirmados)
    if (includePaid === 'false') {
      searchDto.status = TransactionStatus.DRAFT;
    }

    const result = await this.transactionsService.search(searchDto);

    // Transformar al formato esperado por el DataGrid
    return {
      rows: result.data || [],
      total: result.total || 0,
      page: result.page || pageNum,
      pageSize: result.limit || limitNum,
    };
  }

  /**
   * GET /api/supplier-payments/:id
   * Obtiene un pago a proveedor específico
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  /**
   * GET /api/supplier-payments/:id/context
   * Obtiene contexto adicional del pago (proveedor, branch, etc)
   */
  @Get(':id/context')
  async getContext(@Param('id') id: string) {
    const transaction = await this.transactionsService.findOne(id);

    const payment = transaction as any;
    const supplierAccounts = payment?.supplier?.person?.bankAccounts ?? [];
    const companyAccounts = payment?.branch?.company?.bankAccounts ?? [];
    const total = Number(payment?.total ?? 0);
    const amountPaid = Number(payment?.amountPaid ?? 0);
    const pendingAmount = Math.max(total - amountPaid, 0);

    return {
      payment: { ...payment, pendingAmount },
      supplierAccounts,
      companyAccounts,
      supplier: payment?.supplier,
      branch: payment?.branch,
    };
  }

  /**
   * POST /api/supplier-payments
   * Crea un nuevo pago a proveedor
   */
  @Post()
  async create(@Body() data: any) {
    // Forzar tipo PAYMENT_OUT
    const dto = {
      ...data,
      transactionType: TransactionType.PAYMENT_OUT,
    };

    return this.transactionsService.createTransaction(dto);
  }

  /**
   * PUT /api/supplier-payments/:id
   * Actualiza un pago a proveedor
   * TODO: Implementar método update en TransactionsService
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    throw new Error('Method not implemented. Use transactions API directly.');
  }

  /**
   * POST /api/supplier-payments/:id/complete
   * Marca un pago como completado (confirma la transacción)
   */
  @Post(':id/complete')
  async complete(@Param('id') id: string, @Body() data?: any) {
    return this.transactionsService.completePayment(id, data || {});
  }

  /**
   * DELETE /api/supplier-payments/:id
   * Elimina o cancela un pago a proveedor
   * TODO: Implementar método delete en TransactionsService
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    throw new Error('Method not implemented. Use transactions API directly.');
  }
}
