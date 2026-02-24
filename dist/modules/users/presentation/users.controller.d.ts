import { UsersService } from '../application/users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(search?: string): Promise<{
        id: string;
        userName: string;
        mail: string;
        rol: import("../domain/user.entity").UserRole;
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
        rol: import("../domain/user.entity").UserRole;
        person: {
            name: string;
            dni: string | undefined;
            phone: string | undefined;
        } | undefined;
    } | {
        success: boolean;
        message: string;
        statusCode: number;
    }>;
    createUser(data: {
        userName: string;
        mail: string;
        password: string;
        rol?: string;
        personId?: string;
        person?: {
            type?: string;
            firstName: string;
            lastName?: string;
            businessName?: string;
            documentType?: string;
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
            rol: import("../domain/user.entity").UserRole;
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
        rol: string;
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
            rol: import("../domain/user.entity").UserRole;
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
    changePassword(id: string, data: {
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    } | {
        success: boolean;
        message?: undefined;
        statusCode?: undefined;
    }>;
    changeOwnPassword(data: {
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
}
