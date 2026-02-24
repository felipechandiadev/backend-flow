import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { OperationalExpensesRepository } from '../infrastructure/operational-expenses.repository';
import { CreateOperationalExpenseDto } from './dto/create-operational-expense.dto';
import { UpdateOperationalExpenseDto } from './dto/update-operational-expense.dto';
import { OperationalExpense } from '../domain/operational-expense.entity';

@Injectable()
export class OperationalExpensesService {
  private readonly logger = new Logger(OperationalExpensesService.name);

  constructor(
    private readonly repository: OperationalExpensesRepository,
  ) {}

  async findAll(params?: {
    limit?: number;
    offset?: number;
    companyId?: string;
    branchId?: string;
    status?: string;
  }): Promise<{ data: OperationalExpense[]; total: number }> {
    const { limit = 50, offset = 0, companyId, branchId, status } = params || {};

    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (branchId) where.branchId = branchId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.repository.findAll({
        where,
        take: limit,
        skip: offset,
        relations: ['company', 'branch', 'resultCenter', 'category', 'supplier', 'employee'],
        order: { createdAt: 'DESC' },
      }),
      this.repository.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<OperationalExpense> {
    const expense = await this.repository.findOne(id);
    if (!expense) {
      throw new NotFoundException(`Operational expense ${id} not found`);
    }
    return expense;
  }

  async create(dto: CreateOperationalExpenseDto): Promise<OperationalExpense> {
    this.logger.log(`Creating operational expense: ${dto.referenceNumber}`);
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateOperationalExpenseDto): Promise<OperationalExpense> {
    const expense = await this.findOne(id);
    this.logger.log(`Updating operational expense ${id}`);
    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    const expense = await this.findOne(id);
    this.logger.log(`Removing operational expense ${id}`);
    await this.repository.remove(id);
  }
}
