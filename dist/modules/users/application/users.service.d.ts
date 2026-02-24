import { Repository } from 'typeorm';
import { User, UserRole } from '../domain/user.entity';
import { Person, DocumentType, PersonType } from '@modules/persons/domain/person.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly personRepository;
    constructor(userRepository: Repository<User>, personRepository: Repository<Person>);
    getAllUsers(search?: string): Promise<{
        id: string;
        userName: string;
        mail: string;
        rol: UserRole;
        person: {
            name: string;
            dni: string | undefined;
            phone: string | undefined;
        } | undefined;
    }[]>;
    getUserById(id: string): Promise<{
        id: string;
        userName: string;
        mail: string;
        rol: UserRole;
        person: {
            name: string;
            dni: string | undefined;
            phone: string | undefined;
        } | undefined;
    } | null>;
    createUser(data: {
        userName: string;
        mail: string;
        password: string;
        rol?: UserRole | string;
        personId?: string;
        person?: {
            type?: PersonType | string;
            firstName: string;
            lastName?: string;
            businessName?: string;
            documentType?: DocumentType | string;
            documentNumber?: string;
            email?: string;
            phone?: string;
            address?: string;
        };
    }): Promise<{
        success: boolean;
        user: {
            id: string;
            userName: string;
            mail: string;
            rol: UserRole;
            person: {
                name: string;
                dni: string | undefined;
                phone: string | undefined;
            } | undefined;
        } | null;
    }>;
    updateUser(id: string, data: Partial<{
        userName: string;
        mail: string;
        rol: UserRole | string;
        phone?: string;
        personName?: string;
        personDni?: string;
    }>): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
        user?: undefined;
    } | {
        success: boolean;
        user: {
            id: string;
            userName: string;
            mail: string;
            rol: UserRole;
            person: {
                name: string;
                dni: string | undefined;
                phone: string | undefined;
            } | undefined;
        };
        message?: undefined;
        statusCode?: undefined;
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    } | {
        success: boolean;
        message?: undefined;
        statusCode?: undefined;
    }>;
    changePassword(userId: string, password: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    } | {
        success: boolean;
        message?: undefined;
        statusCode?: undefined;
    }>;
    changeOwnPassword(payload: {
        currentUserId?: string;
        newPassword?: string;
    }): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    } | {
        success: boolean;
        message?: undefined;
        statusCode?: undefined;
    }>;
    private mapUser;
    private buildPersonName;
    private splitName;
    private hashPassword;
}
