import { Body, Controller, Get, Post } from '@nestjs/common';
import { BankMovementsService } from '../application/bank-movements.service';

@Controller('bank-movements')
export class BankMovementsController {
  constructor(private readonly bankMovementsService: BankMovementsService) {}

  @Get('overview')
  async getOverview() {
    return this.bankMovementsService.getOverview();
  }

  @Get()
  async list() {
    return this.bankMovementsService.list();
  }

  @Post()
  async create(@Body() _data: Record<string, unknown>) {
    return this.bankMovementsService.create();
  }
}
