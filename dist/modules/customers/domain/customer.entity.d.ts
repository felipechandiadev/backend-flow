import "reflect-metadata";
import { Person } from '@modules/persons/domain/person.entity';
export declare class Customer {
    id: string;
    personId: string;
    creditLimit: number;
    currentBalance: number;
    paymentDayOfMonth: 5 | 10 | 15 | 20 | 25 | 30;
    isActive: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    person?: Person;
}
