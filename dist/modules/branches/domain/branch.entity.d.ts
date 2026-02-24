import "reflect-metadata";
import { Company } from '../../companies/domain/company.entity';
export declare class Branch {
    id: string;
    companyId?: string;
    name: string;
    address?: string;
    phone?: string;
    location?: {
        lat: number;
        lng: number;
    };
    isActive: boolean;
    isHeadquarters: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    company?: Company;
}
