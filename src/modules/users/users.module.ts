import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Person } from '@modules/persons/domain/person.entity';
import { UsersService } from './application/users.service';
import { UsersController } from './presentation/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Person])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
