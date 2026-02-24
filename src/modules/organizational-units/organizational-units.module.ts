import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationalUnit } from './domain/organizational-unit.entity';
import { OrganizationalUnitsService } from './application/organizational-units.service';
import { OrganizationalUnitsController } from './presentation/organizational-units.controller';
import { Company } from '../companies/domain/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationalUnit, Company])],
  controllers: [OrganizationalUnitsController],
  providers: [OrganizationalUnitsService],
  exports: [OrganizationalUnitsService],
})
export class OrganizationalUnitsModule {}
