import { ReceptionsService } from '../application/receptions.service';
export declare class ReceptionsController {
    private readonly receptionsService;
    constructor(receptionsService: ReceptionsService);
    findAll(limit?: string, offset?: string): Promise<{
        rows: any[];
        count: number;
        limit: number;
        offset: number;
    }>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<{
        success: boolean;
        reception: import("../domain/reception.entity").Reception | null;
        transaction: {
            id: any;
        } | null;
        transactionError: any;
    }>;
    createDirect(body: any): Promise<{
        success: boolean;
        reception: import("../domain/reception.entity").Reception | null;
        transaction: {
            id: any;
        } | null;
        transactionError: any;
    }>;
    createFromPurchaseOrder(body: any): Promise<{
        success: boolean;
        reception: import("../domain/reception.entity").Reception | null;
        transaction: {
            id: any;
        } | null;
        transactionError: any;
    }>;
}
