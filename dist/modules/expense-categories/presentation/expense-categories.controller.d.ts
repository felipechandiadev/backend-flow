import { ExpenseCategoriesService } from '../application/expense-categories.service';
import { CreateExpenseCategoryDto } from '../application/dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from '../application/dto/update-expense-category.dto';
export declare class ExpenseCategoriesController {
    private readonly service;
    constructor(service: ExpenseCategoriesService);
    findAll(query: any): Promise<{
        data: import("../domain/expense-category.entity").ExpenseCategory[];
        total: number;
    }>;
    findOne(id: string): Promise<import("../domain/expense-category.entity").ExpenseCategory>;
    create(dto: CreateExpenseCategoryDto): Promise<import("../domain/expense-category.entity").ExpenseCategory>;
    update(id: string, dto: UpdateExpenseCategoryDto): Promise<import("../domain/expense-category.entity").ExpenseCategory>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
