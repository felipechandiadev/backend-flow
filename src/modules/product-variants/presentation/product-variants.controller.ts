import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ProductVariantsService } from '../application/product-variants.service';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly variantsService: ProductVariantsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.variantsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.variantsService.findOne(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.variantsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.variantsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.variantsService.remove(id);
  }
}
