import { Body, Controller, Get, Post } from '@nestjs/common';
import { CashDepositsService } from '../application/cash-deposits.service';

@Controller('cash-deposits')
export class CashDepositsController {
  constructor(private readonly cashDepositsService: CashDepositsService) {}

  @Get()
  async list() {
    return this.cashDepositsService.list();
  }

  @Post()
  async create(@Body() payload: Record<string, unknown>) {
    return this.cashDepositsService.create(payload);
  }
}
