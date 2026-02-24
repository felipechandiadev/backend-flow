import { CategoryService } from '../application/category.service';
import { CategoryWithCountsDto } from '../application/dto/category-with-counts.dto';
import { CreateCategoryDto } from '../application/dto/create-category.dto';
import { UpdateCategoryDto } from '../application/dto/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(query: any): Promise<import("../domain/category.entity").Category[]>;
    getCategoriesWithCounts(): Promise<CategoryWithCountsDto[]>;
    findOne(id: string): Promise<import("../domain/category.entity").Category>;
    create(dto: CreateCategoryDto): Promise<import("../domain/category.entity").Category>;
    update(id: string, dto: UpdateCategoryDto): Promise<import("../domain/category.entity").Category>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
