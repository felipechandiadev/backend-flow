import { PersonsService } from '../application/persons.service';
import { Person, PersonType, PersonBankAccount } from '../domain/person.entity';
export declare class PersonsController {
    private readonly personsService;
    constructor(personsService: PersonsService);
    findAll(term?: string, limit?: string, type?: PersonType, includeInactive?: string): Promise<{
        success: boolean;
        data: Person[];
    }>;
    findOne(id: string, includeInactive?: string): Promise<{
        success: boolean;
        person: Person;
    }>;
    create(data: Partial<Person>): Promise<{
        success: boolean;
        person: Person;
    }>;
    update(id: string, data: Partial<Person>): Promise<{
        success: boolean;
        person: Person;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addBankAccount(personId: string, accountData: PersonBankAccount): Promise<{
        success: boolean;
        person: Person;
    }>;
    removeBankAccount(personId: string, accountKey: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
