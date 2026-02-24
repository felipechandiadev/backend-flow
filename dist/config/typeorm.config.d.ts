import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';
export declare const typeOrmConfig: (configService: ConfigService) => TypeOrmModuleOptions;
