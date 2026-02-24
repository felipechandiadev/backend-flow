import { PersonType, DocumentType } from '../../../persons/domain/person.entity';
export declare class CreateCustomerDto {
    personType: PersonType;
    firstName: string;
    lastName?: string;
    businessName?: string;
    documentType?: DocumentType;
    documentNumber?: string;
    email?: string;
    phone?: string;
    address?: string;
    creditLimit?: number;
    paymentDayOfMonth?: 5 | 10 | 15 | 20 | 25 | 30;
    notes?: string;
}
