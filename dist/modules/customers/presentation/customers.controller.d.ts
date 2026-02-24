import { CustomersService } from '../application/customers.service';
import { CreateCustomerDto } from '../application/dto/create-customer.dto';
import { UpdateCustomerDto } from '../application/dto/update-customer.dto';
import { SearchCustomersDto } from '../application/dto/search-customers.dto';
import { InstallmentService } from '@modules/installments/application/services/installment.service';
export declare class CustomersController {
    private readonly customersService;
    private readonly installmentService;
    constructor(customersService: CustomersService, installmentService: InstallmentService);
    search(searchDto: SearchCustomersDto): Promise<{
        success: boolean;
        page: number;
        pageSize: number;
        total: number;
        customers: {
            customerId: string;
            personId: string;
            displayName: string;
            documentNumber: string | null;
            email: string | null;
            phone: string | null;
            creditLimit: number;
            currentBalance: number;
            availableCredit: number;
            paymentDayOfMonth: 10 | 5 | 15 | 20 | 25 | 30;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    list(searchDto: SearchCustomersDto): Promise<{
        success: boolean;
        page: number;
        pageSize: number;
        total: number;
        customers: {
            customerId: string;
            personId: string;
            displayName: string;
            documentNumber: string | null;
            email: string | null;
            phone: string | null;
            creditLimit: number;
            currentBalance: number;
            availableCredit: number;
            paymentDayOfMonth: 10 | 5 | 15 | 20 | 25 | 30;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    create(createCustomerDto: CreateCustomerDto): Promise<{
        success: boolean;
        customer: {
            customerId: string;
            personId: string;
            displayName: string;
            documentType: import("../../persons/domain/person.entity").DocumentType | null;
            documentNumber: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            creditLimit: number;
            usedCredit: number;
            availableCredit: number;
            paymentDayOfMonth: 10 | 5 | 15 | 20 | 25 | 30;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<{
        success: boolean;
        error: string;
        customer?: undefined;
    } | {
        success: boolean;
        customer: {
            customerId: string;
            creditLimit: number;
            paymentDayOfMonth: 10 | 5 | 15 | 20 | 25 | 30;
            notes: string | undefined;
            isActive: boolean;
            updatedAt: Date;
        };
        error?: undefined;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    }>;
    getPendingPayments(id: string): Promise<{
        transactionId: string;
        documentNumber: any;
        transactionDate: Date;
        total: number;
        quotas: any;
    }[]>;
    getPendingQuotas(id: string): Promise<{
        success: boolean;
        quotas: {
            id: any;
            transactionId: any;
            documentNumber: any;
            amount: number;
            dueDate: any;
            createdAt: any;
        }[];
    }>;
    getPurchases(id: string): Promise<{
        success: boolean;
        purchases: {
            id: string;
            documentNumber: any;
            status: import("../../transactions/domain/transaction.entity").TransactionStatus;
            total: number;
            createdAt: Date;
        }[];
    }>;
    getPurchasesByStatus(id: string, status: string): Promise<{
        success: boolean;
        purchases: {
            id: string;
            documentNumber: any;
            status: import("../../transactions/domain/transaction.entity").TransactionStatus;
            total: number;
            createdAt: Date;
        }[];
    }>;
    getPayments(id: string): Promise<{
        success: boolean;
        payments: {
            success: boolean;
            total: number;
            payments: {
                id: string;
                documentNumber: any;
                type: any;
                status: any;
                total: number;
                paymentMethod: any;
                createdAt: Date;
            }[];
        };
    }>;
    findOne(id: string): Promise<{
        customer: {
            customerId: string;
            personId: string;
            displayName: string;
            documentType: import("../../persons/domain/person.entity").DocumentType | null;
            documentNumber: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            creditLimit: number;
            usedCredit: number;
            availableCredit: number;
            paymentDayOfMonth: 10 | 5 | 15 | 20 | 25 | 30;
            isActive: boolean;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
}
