import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './domain/supplier.entity';
import { SuppliersService } from './application/suppliers.service';
import { SuppliersController } from './presentation/suppliers.controller';
import { SuppliersRepository } from './infrastructure/suppliers.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier]),
  ],
  controllers: [SuppliersController],
  providers: [
    SuppliersService,
    SuppliersRepository,
  ],
  exports: [SuppliersService],
})
export class SuppliersModule {}
