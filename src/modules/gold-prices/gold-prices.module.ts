import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoldPrice } from './domain/gold-price.entity';
import { GoldPricesController } from './presentation/gold-prices.controller';
import { GoldPricesService } from './application/gold-prices.service';

@Module({
  imports: [TypeOrmModule.forFeature([GoldPrice])],
  controllers: [GoldPricesController],
  providers: [GoldPricesService],
  exports: [GoldPricesService],
})
export class GoldPricesModule {}
