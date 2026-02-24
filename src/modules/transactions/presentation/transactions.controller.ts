import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransactionsService } from '../application/transactions.service';
import { SearchTransactionsDto } from '../application/dto/search-transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async search(@Query() query: SearchTransactionsDto) {
    return this.transactionsService.search(query);
  }

  @Get('journal')
  async listJournal(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('limit') limit?: string,
    @Query('filters') filters?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('search') search?: string,
  ) {
    // Convertir a números
    const pageNum = parseInt(page || '1', 10);
    const pageSizeNum = parseInt(pageSize || limit || '25', 10);

    return this.transactionsService.listJournal({
      page: pageNum,
      pageSize: pageSizeNum,
      limit: pageSizeNum,
      filters: filters ? JSON.parse(filters) : undefined,
      type,
      status,
      dateFrom,
      dateTo,
      search,
    } as any);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }
}
