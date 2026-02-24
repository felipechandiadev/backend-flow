import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultCenter } from './domain/result-center.entity';
import { ResultCentersService } from './application/result-centers.service';
import { ResultCentersController } from './presentation/result-centers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResultCenter])],
  controllers: [ResultCentersController],
  providers: [ResultCentersService],
  exports: [ResultCentersService],
})
export class ResultCentersModule {}
