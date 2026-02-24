import { OperationalExpensesService } from '../application/operational-expenses.service';
import { CreateOperationalExpenseDto } from '../application/dto/create-operational-expense.dto';
import { UpdateOperationalExpenseDto } from '../application/dto/update-operational-expense.dto';
export declare class OperationalExpensesController {
    private readonly service;
    constructor(service: OperationalExpensesService);
    findAll(query: any): Promise<{
        data: import("../domain/operational-expense.entity").OperationalExpense[];
        total: number;
    }>;
    findOne(id: string): Promise<import("../domain/operational-expense.entity").OperationalExpense>;
    create(dto: CreateOperationalExpenseDto): Promise<import("../domain/operational-expense.entity").OperationalExpense>;
    update(id: string, dto: UpdateOperationalExpenseDto): Promise<import("../domain/operational-expense.entity").OperationalExpense>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
