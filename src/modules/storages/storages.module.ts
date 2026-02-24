import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './domain/storage.entity';
import { StoragesService } from './application/storages.service';
import { StoragesController } from './presentation/storages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  controllers: [StoragesController],
  providers: [StoragesService],
  exports: [StoragesService],
})
export class StoragesModule {}
