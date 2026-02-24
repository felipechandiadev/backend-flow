import { RemunerationsService } from '../application/remunerations.service';
import { TransactionStatus } from '../../transactions/domain/transaction.entity';
export declare class RemunerationsController {
    private readonly remunerationsService;
    constructor(remunerationsService: RemunerationsService);
    getRemunerations(employeeId?: string, status?: string): Promise<{
        success: boolean;
        data: {
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
        }[];
    }>;
    getRemunerationById(id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    createRemuneration(data: {
        employeeId: string;
        resultCenterId?: string | null;
        date: string;
        lines: Array<{
            typeId: string;
            amount: number;
        }>;
        userId?: string;
    }): Promise<{
        success: boolean;
        data: {
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
        } | null;
    }>;
    updateRemuneration(id: string, data: Partial<{
        date: string;
        status: TransactionStatus;
        resultCenterId?: string | null;
        lines: Array<{
            typeId: string;
            amount: number;
        }>;
    }>): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    deleteRemuneration(id: string): Promise<{
        success: boolean;
    }>;
}
