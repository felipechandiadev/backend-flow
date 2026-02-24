import { Repository } from 'typeorm';
import { Person, PersonType, PersonBankAccount } from '../domain/person.entity';
export declare class PersonsService {
    private readonly personsRepository;
    constructor(personsRepository: Repository<Person>);
    findAll(params?: {
        term?: string;
        limit?: number;
        type?: PersonType;
        includeInactive?: boolean;
    }): Promise<Person[]>;
    findOne(id: string, includeInactive?: boolean): Promise<Person>;
    create(data: Partial<Person>): Promise<Person>;
    update(id: string, data: Partial<Person>): Promise<Person>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addBankAccount(personId: string, accountData: PersonBankAccount): Promise<Person>;
    removeBankAccount(personId: string, accountKey: string): Promise<{
        message: string;
    }>;
}
