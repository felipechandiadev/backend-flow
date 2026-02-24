import "reflect-metadata";
import { Person } from '../../persons/domain/person.entity';
export declare enum UserRole {
    ADMIN = "ADMIN",
    OPERATOR = "OPERATOR"
}
export declare class User {
    id: string;
    userName: string;
    pass: string;
    mail: string;
    rol: UserRole;
    person?: Person;
    deletedAt?: Date;
}
