import { Repository } from 'typeorm';
import { Customer } from '@modules/customers/domain/customer.entity';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { StockLevel } from '@modules/stock-levels/domain/stock-level.entity';
export type DashboardStats = {
    salesToday: number;
    totalCustomers: number;
    lowStockItems: number;
    openOrders: number;
};
export declare class AnalyticsService {
    private readonly customerRepository;
    private readonly transactionRepository;
    private readonly stockLevelRepository;
    constructor(customerRepository: Repository<Customer>, transactionRepository: Repository<Transaction>, stockLevelRepository: Repository<StockLevel>);
    getDashboardStats(): Promise<DashboardStats>;
    private computeStats;
}
