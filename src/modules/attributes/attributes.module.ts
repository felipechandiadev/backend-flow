import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './domain/attribute.entity';
import { AttributesService } from './application/attributes.service';
import { AttributesController } from './presentation/attributes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute])],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService],
})
export class AttributesModule {}
