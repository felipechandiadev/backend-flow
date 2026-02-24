import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './domain/unit.entity';
import { UnitsService } from './application/units.service';
import { UnitsController } from './presentation/units.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
