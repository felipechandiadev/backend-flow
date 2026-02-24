import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BankAccountsService } from '../application/bank-accounts.service';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Get('cash-balance')
  async getCashBalance() {
    return this.bankAccountsService.getCashBalance();
  }

  @Get()
  async list() {
    return this.bankAccountsService.list();
  }

  @Get(':id')
  async findOne(@Param('id') _id: string) {
    return this.bankAccountsService.findOne();
  }

  @Post()
  async create(@Body() _data: Record<string, unknown>) {
    return this.bankAccountsService.create();
  }

  @Put(':id')
  async update(@Param('id') _id: string, @Body() _data: Record<string, unknown>) {
    return this.bankAccountsService.update();
  }

  @Delete(':id')
  async remove(@Param('id') _id: string) {
    return this.bankAccountsService.remove();
  }
}
