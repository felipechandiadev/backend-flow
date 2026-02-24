import { BranchesService } from '../application/branches.service';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    getBranches(includeInactive?: string): Promise<{
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
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
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
        };
        error?: undefined;
    }>;
}
