import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './presentation/inventory.controller';
import { InventoryService } from './application/inventory.service';
import { StoragesModule } from '../storages/storages.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { User } from '@modules/users/domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), StoragesModule, TransactionsModule],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
