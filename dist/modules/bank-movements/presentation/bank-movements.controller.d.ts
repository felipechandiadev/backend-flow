import { BankMovementsService } from '../application/bank-movements.service';
export declare class BankMovementsController {
    private readonly bankMovementsService;
    constructor(bankMovementsService: BankMovementsService);
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
    create(_data: Record<string, unknown>): Promise<{
        success: boolean;
    }>;
}
