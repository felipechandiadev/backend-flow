import { Repository, FindManyOptions } from 'typeorm';
import { OperationalExpense } from '../domain/operational-expense.entity';
export declare class OperationalExpensesRepository {
    private readonly repository;
    constructor(repository: Repository<OperationalExpense>);
    findAll(options?: FindManyOptions<OperationalExpense>): Promise<OperationalExpense[]>;
    findOne(id: string): Promise<OperationalExpense | null>;
    create(data: Partial<OperationalExpense>): Promise<OperationalExpense>;
    update(id: string, data: Partial<OperationalExpense>): Promise<OperationalExpense>;
    remove(id: string): Promise<void>;
    count(options?: FindManyOptions<OperationalExpense>): Promise<number>;
}
