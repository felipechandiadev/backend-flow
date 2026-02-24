"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../domain/category.entity");
const product_entity_1 = require("../../products/domain/product.entity");
let CategoryService = class CategoryService {
    constructor(categoryRepository, productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }
    async findAll(query) {
        const categories = await this.categoryRepository.find({
            where: { deletedAt: null },
            order: { name: 'ASC' },
        });
        return categories;
    }
    async findOne(id) {
        const category = await this.categoryRepository.findOne({
            where: { id, deletedAt: null },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async create(data) {
        try {
            if (!data.name || !data.name.trim()) {
                throw new common_1.BadRequestException('El nombre de la categoría es requerido');
            }
            const category = this.categoryRepository.create({
                name: data.name.trim(),
                description: data.description || null,
                parentId: data.parentId || null,
                sortOrder: data.sortOrder || 0,
                isActive: data.isActive !== false,
                imagePath: data.imagePath || null,
                resultCenterId: data.resultCenterId || null,
            });
            return await this.categoryRepository.save(category);
        }
        catch (error) {
            console.error('Error creating category:', error);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to create category: ${error.message}`);
        }
    }
    async update(id, data) {
        const category = await this.findOne(id);
        Object.assign(category, data);
        return await this.categoryRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        category.deletedAt = new Date();
        await this.categoryRepository.save(category);
    }
    async getCategoriesWithCounts() {
        const categories = await this.categoryRepository.find({
            where: { deletedAt: null },
            order: { name: 'ASC' },
        });
        const childCountMap = {};
        for (const category of categories) {
            if (category.parentId) {
                childCountMap[category.parentId] = (childCountMap[category.parentId] || 0) + 1;
            }
        }
        const productCountMap = {};
        if (categories.length > 0) {
            const categoryIds = categories.map(cat => cat.id);
            const rawCounts = await this.productRepository
                .createQueryBuilder('product')
                .select('product.categoryId', 'categoryId')
                .addSelect('COUNT(*)', 'count')
                .where('product.deletedAt IS NULL')
                .andWhere('product.isActive = :isActive', { isActive: true })
                .andWhere('product.categoryId IN (:...categoryIds)', { categoryIds })
                .groupBy('product.categoryId')
                .getRawMany();
            for (const row of rawCounts) {
                if (row.categoryId) {
                    productCountMap[row.categoryId] = Number(row.count) || 0;
                }
            }
        }
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            parentId: category.parentId,
            productCount: productCountMap[category.id] || 0,
            childCount: childCountMap[category.id] || 0,
        }));
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CategoryService);
//# sourceMappingURL=category.service.js.map