import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { SuppliersService } from '../application/suppliers.service';
import { CreateSupplierDto } from '../application/dto/create-supplier.dto';
import { UpdateSupplierDto } from '../application/dto/update-supplier.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(
    private readonly service: SuppliersService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll({
      limit: query.limit ? parseInt(query.limit) : 50,
      offset: query.offset ? parseInt(query.offset) : 0,
      isActive: query.isActive === 'true' ? true : query.isActive === 'false' ? false : undefined,
      supplierType: query.supplierType,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateSupplierDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }
}
