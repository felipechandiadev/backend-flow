import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './presentation/customers.controller';
import { CustomersService } from './application/customers.service';
import { Customer } from '@modules/customers/domain/customer.entity';
import { Person } from '@modules/persons/domain/person.entity';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { InstallmentsModule } from '@modules/installments/installments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Person, Transaction]), InstallmentsModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
