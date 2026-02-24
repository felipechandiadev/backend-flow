import { Repository } from 'typeorm';
import { TransactionsService } from '@modules/transactions/application/transactions.service';
import { Transaction, TransactionStatus } from '@modules/transactions/domain/transaction.entity';
import { Employee } from '@modules/employees/domain/employee.entity';
import { ResultCenter } from '@modules/result-centers/domain/result-center.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { User } from '@modules/users/domain/user.entity';
interface RemunerationLineInput {
    typeId: string;
    amount: number;
}
export declare class RemunerationsService {
    private readonly transactionsService;
    private readonly transactionRepository;
    private readonly employeeRepository;
    private readonly resultCenterRepository;
    private readonly branchRepository;
    private readonly userRepository;
    constructor(transactionsService: TransactionsService, transactionRepository: Repository<Transaction>, employeeRepository: Repository<Employee>, resultCenterRepository: Repository<ResultCenter>, branchRepository: Repository<Branch>, userRepository: Repository<User>);
    getRemunerationById(id: string): Promise<{
        id: string;
        date: any;
        employeeId: string | null;
        employeeName: string;
        resultCenterId: string | null;
        totalEarnings: number;
        totalDeductions: number;
        netPayment: number;
        status: TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        lines: any;
    } | null>;
    getAllRemunerations(params?: {
        employeeId?: string;
        status?: TransactionStatus;
    }): Promise<{
        id: string;
        date: any;
        employeeId: string | null;
        employeeName: string;
        resultCenterId: string | null;
        totalEarnings: number;
        totalDeductions: number;
        netPayment: number;
        status: TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        lines: any;
    }[]>;
    createRemuneration(data: {
        employeeId: string;
        resultCenterId?: string | null;
        date: string;
        lines: RemunerationLineInput[];
        userId?: string;
    }): Promise<{
        id: string;
        date: any;
        employeeId: string | null;
        employeeName: string;
        resultCenterId: string | null;
        totalEarnings: number;
        totalDeductions: number;
        netPayment: number;
        status: TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        lines: any;
    } | null>;
    updateRemuneration(id: string, data: Partial<{
        date: string;
        status: TransactionStatus;
        resultCenterId?: string | null;
        lines: RemunerationLineInput[];
    }>): Promise<{
        id: string;
        date: any;
        employeeId: string | null;
        employeeName: string;
        resultCenterId: string | null;
        totalEarnings: number;
        totalDeductions: number;
        netPayment: number;
        status: TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        lines: any;
    } | null>;
    deleteRemuneration(id: string): Promise<{
        success: boolean;
    }>;
    private calculateTotals;
    private formatRemuneration;
    private resolveBranchId;
    private resolveUserId;
}
export {};
