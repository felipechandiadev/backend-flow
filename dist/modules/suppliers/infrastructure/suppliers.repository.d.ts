import { Repository, FindManyOptions } from 'typeorm';
import { Supplier } from '../domain/supplier.entity';
export declare class SuppliersRepository {
    private readonly repository;
    constructor(repository: Repository<Supplier>);
    findAll(options?: FindManyOptions<Supplier>): Promise<Supplier[]>;
    findOne(id: string): Promise<Supplier | null>;
    create(data: Partial<Supplier>): Promise<Supplier>;
    update(id: string, data: Partial<Supplier>): Promise<Supplier>;
    remove(id: string): Promise<void>;
    count(options?: FindManyOptions<Supplier>): Promise<number>;
}
