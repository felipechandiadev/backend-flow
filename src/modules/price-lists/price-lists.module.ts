import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceList } from './domain/price-list.entity';
import { PriceListsService } from './application/price-lists.service';
import { PriceListsController } from './presentation/price-lists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PriceList])],
  controllers: [PriceListsController],
  providers: [PriceListsService],
  exports: [PriceListsService],
})
export class PriceListsModule {}
