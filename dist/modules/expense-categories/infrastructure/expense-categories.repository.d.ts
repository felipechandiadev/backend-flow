import { Repository, FindManyOptions } from 'typeorm';
import { ExpenseCategory } from '../domain/expense-category.entity';
export declare class ExpenseCategoriesRepository {
    private readonly repository;
    constructor(repository: Repository<ExpenseCategory>);
    findAll(options?: FindManyOptions<ExpenseCategory>): Promise<ExpenseCategory[]>;
    findOne(id: string): Promise<ExpenseCategory | null>;
    create(data: Partial<ExpenseCategory>): Promise<ExpenseCategory>;
    update(id: string, data: Partial<ExpenseCategory>): Promise<ExpenseCategory>;
    remove(id: string): Promise<void>;
    count(options?: FindManyOptions<ExpenseCategory>): Promise<number>;
}
