import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './domain/employee.entity';
import { Company } from '@modules/companies/domain/company.entity';
import { EmployeesService } from './application/employees.service';
import { EmployeesController } from './presentation/employees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Company])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
