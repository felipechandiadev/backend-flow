import { Repository } from 'typeorm';
import { Customer } from '../../customers/domain/customer.entity';
import { Person } from '../../persons/domain/person.entity';
import { Transaction } from '../../transactions/domain/transaction.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { SearchCustomersDto } from './dto/search-customers.dto';
export declare class CustomersService {
    private readonly customerRepository;
    private readonly personRepository;
    private readonly transactionRepository;
    constructor(customerRepository: Repository<Customer>, personRepository: Repository<Person>, transactionRepository: Repository<Transaction>);
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
            paymentDayOfMonth: 10 | 20 | 15 | 5 | 25 | 30;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(customerId: string, updateData: any): Promise<{
        success: boolean;
        error: string;
        customer?: undefined;
    } | {
        success: boolean;
        customer: {
            customerId: string;
            creditLimit: number;
            paymentDayOfMonth: 10 | 20 | 15 | 5 | 25 | 30;
            notes: string | undefined;
            isActive: boolean;
            updatedAt: Date;
        };
        error?: undefined;
    }>;
    delete(customerId: string): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    }>;
    findOne(id: string): Promise<{
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
        paymentDayOfMonth: 10 | 20 | 15 | 5 | 25 | 30;
        isActive: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getPayments(customerId: string): Promise<{
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
    }>;
    search(dto: SearchCustomersDto): Promise<{
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
            paymentDayOfMonth: 10 | 20 | 15 | 5 | 25 | 30;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getPendingPayments(customerId: string): Promise<{
        transactionId: string;
        documentNumber: any;
        transactionDate: Date;
        total: number;
        quotas: any;
    }[]>;
    getPurchases(customerId: string, status?: string): Promise<{
        id: string;
        documentNumber: any;
        status: import("../../transactions/domain/transaction.entity").TransactionStatus;
        total: number;
        createdAt: Date;
    }[]>;
    private buildDisplayName;
    private calculateAvailableCredit;
}
