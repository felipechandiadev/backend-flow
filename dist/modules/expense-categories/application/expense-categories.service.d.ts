import { ExpenseCategoriesRepository } from '../infrastructure/expense-categories.repository';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { ExpenseCategory } from '../domain/expense-category.entity';
export declare class ExpenseCategoriesService {
    private readonly repository;
    private readonly logger;
    constructor(repository: ExpenseCategoriesRepository);
    findAll(params?: {
        limit?: number;
        offset?: number;
        companyId?: string;
        isActive?: boolean;
    }): Promise<{
        data: ExpenseCategory[];
        total: number;
    }>;
    findOne(id: string): Promise<ExpenseCategory>;
    create(dto: CreateExpenseCategoryDto): Promise<ExpenseCategory>;
    update(id: string, dto: UpdateExpenseCategoryDto): Promise<ExpenseCategory>;
    remove(id: string): Promise<void>;
}
