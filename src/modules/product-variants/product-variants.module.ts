import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './domain/product-variant.entity';
import { PriceListItem } from '@modules/price-list-items/domain/price-list-item.entity';
import { ProductVariantsService } from './application/product-variants.service';
import { ProductVariantsController } from './presentation/product-variants.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant, PriceListItem])],
  providers: [ProductVariantsService],
  controllers: [ProductVariantsController],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
