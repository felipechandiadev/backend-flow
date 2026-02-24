import "reflect-metadata";
export declare class Attribute {
    id: string;
    name: string;
    description?: string;
    options: string[];
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
