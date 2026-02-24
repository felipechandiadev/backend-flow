import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './domain/category.entity';
import { Product } from '@modules/products/domain/product.entity';
import { CategoryService } from './application/category.service';
import { CategoryController } from './presentation/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoriesModule {}
