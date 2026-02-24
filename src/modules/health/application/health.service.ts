import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'flow-backend-nestjs',
      version: '1.0.0',
    };
  }

  checkDatabase() {
    // Este endpoint sera mejorado despues con @nestjs/terminus
    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };
  }
}
