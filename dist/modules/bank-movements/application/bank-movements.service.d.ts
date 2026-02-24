import { Repository } from 'typeorm';
import { Company } from '../../companies/domain/company.entity';
import { Transaction } from '../../transactions/domain/transaction.entity';
export declare class BankMovementsService {
    private readonly transactionRepository;
    private readonly companyRepository;
    constructor(transactionRepository: Repository<Transaction>, companyRepository: Repository<Company>);
    getOverview(): Promise<{
        summary: {
            projectedBalance: number;
            incomingTotal: number;
            outgoingTotal: number;
        };
        monthMovements: {
            id: string;
            createdAt: Date;
            documentNumber: string;
            movementKind: string;
            direction: "IN" | "OUT";
            total: number;
            bankAccountKey: any;
            bankAccountLabel: string | null;
            bankAccountNumber: string | null;
            bankAccountBalance: number | null;
            counterpartyName: string | null;
            notes: string | null;
        }[];
        recentMovements: {
            id: string;
            createdAt: Date;
            documentNumber: string;
            movementKind: string;
            direction: "IN" | "OUT";
            total: number;
            bankAccountKey: any;
            bankAccountLabel: string | null;
            bankAccountNumber: string | null;
            bankAccountBalance: number | null;
            counterpartyName: string | null;
            notes: string | null;
        }[];
    }>;
    list(): Promise<{
        id: string;
        createdAt: Date;
        documentNumber: string;
        movementKind: string;
        direction: "IN" | "OUT";
        total: number;
        bankAccountKey: any;
        bankAccountLabel: string | null;
        bankAccountNumber: string | null;
        bankAccountBalance: number | null;
        counterpartyName: string | null;
        notes: string | null;
    }[]>;
    create(): Promise<{
        success: boolean;
    }>;
    private buildMovementList;
    private loadBankAccountsMap;
    private resolveMovementKind;
    private resolveDirection;
    private resolveCounterpartyName;
}
