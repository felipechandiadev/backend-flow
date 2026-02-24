import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shareholder } from './domain/shareholder.entity';
import { ShareholdersService } from './application/shareholders.service';
import { ShareholdersController } from './presentation/shareholders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shareholder])],
  controllers: [ShareholdersController],
  providers: [ShareholdersService],
  exports: [ShareholdersService],
})
export class ShareholdersModule {}
