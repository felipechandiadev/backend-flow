import { Repository } from 'typeorm';
import { Category } from '../domain/category.entity';
import { Product } from '../../products/domain/product.entity';
import { CategoryWithCountsDto } from './dto/category-with-counts.dto';
export declare class CategoryService {
    private readonly categoryRepository;
    private readonly productRepository;
    constructor(categoryRepository: Repository<Category>, productRepository: Repository<Product>);
    findAll(query: any): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    create(data: any): Promise<Category>;
    update(id: string, data: any): Promise<Category>;
    remove(id: string): Promise<void>;
    getCategoriesWithCounts(): Promise<CategoryWithCountsDto[]>;
}
