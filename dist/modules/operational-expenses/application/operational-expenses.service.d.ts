import { OperationalExpensesRepository } from '../infrastructure/operational-expenses.repository';
import { CreateOperationalExpenseDto } from './dto/create-operational-expense.dto';
import { UpdateOperationalExpenseDto } from './dto/update-operational-expense.dto';
import { OperationalExpense } from '../domain/operational-expense.entity';
export declare class OperationalExpensesService {
    private readonly repository;
    private readonly logger;
    constructor(repository: OperationalExpensesRepository);
    findAll(params?: {
        limit?: number;
        offset?: number;
        companyId?: string;
        branchId?: string;
        status?: string;
    }): Promise<{
        data: OperationalExpense[];
        total: number;
    }>;
    findOne(id: string): Promise<OperationalExpense>;
    create(dto: CreateOperationalExpenseDto): Promise<OperationalExpense>;
    update(id: string, dto: UpdateOperationalExpenseDto): Promise<OperationalExpense>;
    remove(id: string): Promise<void>;
}
