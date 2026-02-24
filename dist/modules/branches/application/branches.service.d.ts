import { Repository } from 'typeorm';
import { Branch } from '../domain/branch.entity';
export declare class BranchesService {
    private readonly branchRepository;
    constructor(branchRepository: Repository<Branch>);
    getBranchById(id: string): Promise<{
        id: string;
        companyId: string | null;
        name: string;
        address: string | null;
        phone: string | null;
        location: {
            lat: number;
            lng: number;
        } | null;
        isActive: boolean;
        isHeadquarters: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getAllBranches(includeInactive: boolean): Promise<{
        id: string;
        companyId: string | null;
        name: string;
        address: string | null;
        phone: string | null;
        location: {
            lat: number;
            lng: number;
        } | null;
        isActive: boolean;
        isHeadquarters: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateBranch(id: string, data: Partial<{
        name: string;
        address: string | null;
        phone: string | null;
        location: {
            lat: number;
            lng: number;
        } | null;
        isActive: boolean;
        isHeadquarters: boolean;
    }>): Promise<{
        id: string;
        companyId: string | null;
        name: string;
        address: string | null;
        phone: string | null;
        location: {
            lat: number;
            lng: number;
        } | null;
        isActive: boolean;
        isHeadquarters: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
