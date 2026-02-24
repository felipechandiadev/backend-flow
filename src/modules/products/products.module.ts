import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from '@modules/product-variants/domain/product-variant.entity';
import { Product } from '@modules/products/domain/product.entity';
import { Tax } from '@modules/taxes/domain/tax.entity';
import { Attribute } from '@modules/attributes/domain/attribute.entity';
import { PriceListItem } from '@modules/price-list-items/domain/price-list-item.entity';
import { StockLevel } from '@modules/stock-levels/domain/stock-level.entity';
import { ProductsController } from './presentation/products.controller';
import { ProductsService } from './application/products.service';
import { ProductsPosService } from './application/products-pos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductVariant, Tax, Attribute, PriceListItem, StockLevel])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsPosService],
})
export class ProductsModule {}
