import { Body, Controller, Get, Post } from '@nestjs/common';
import { BankTransfersService } from '../application/bank-transfers.service';

@Controller('bank-transfers')
export class BankTransfersController {
  constructor(private readonly bankTransfersService: BankTransfersService) {}

  @Get()
  async list() {
    return this.bankTransfersService.list();
  }

  @Post()
  async create(@Body() payload: Record<string, unknown>) {
    return this.bankTransfersService.create(payload);
  }
}
