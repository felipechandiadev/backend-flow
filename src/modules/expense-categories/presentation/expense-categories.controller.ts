import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ExpenseCategoriesService } from '../application/expense-categories.service';
import { CreateExpenseCategoryDto } from '../application/dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from '../application/dto/update-expense-category.dto';

@Controller('expense-categories')
export class ExpenseCategoriesController {
  constructor(
    private readonly service: ExpenseCategoriesService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll({
      limit: query.limit ? parseInt(query.limit) : 50,
      offset: query.offset ? parseInt(query.offset) : 0,
      companyId: query.companyId,
      isActive: query.isActive === 'true' ? true : query.isActive === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateExpenseCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExpenseCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }
}
