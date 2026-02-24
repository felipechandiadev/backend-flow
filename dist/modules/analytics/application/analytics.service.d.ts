import { Repository } from 'typeorm';
import { Customer } from '../../customers/domain/customer.entity';
import { Transaction } from '../../transactions/domain/transaction.entity';
import { StockLevel } from '../../stock-levels/domain/stock-level.entity';
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
