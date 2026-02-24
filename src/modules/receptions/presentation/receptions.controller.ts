import { Controller, Get, Query, Post, Body, Param } from '@nestjs/common';
import { ReceptionsService } from '../application/receptions.service';

@Controller('receptions')
export class ReceptionsController {
  constructor(private readonly receptionsService: ReceptionsService) {}

  @Get()
  async findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const l = limit ? parseInt(limit, 10) : 25;
    const o = offset ? parseInt(offset, 10) : 0;
    return this.receptionsService.search({ limit: l, offset: o });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.receptionsService.getById(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.receptionsService.create(body);
  }

  @Post('direct')
  async createDirect(@Body() body: any) {
    return this.receptionsService.createDirect(body);
  }

  @Post('from-purchase-order')
  async createFromPurchaseOrder(@Body() body: any) {
    return this.receptionsService.createFromPurchaseOrder(body);
  }
}
