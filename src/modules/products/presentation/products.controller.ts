import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ProductsService } from '../application/products.service';
import { ProductsPosService } from '../application/products-pos.service';
import { SearchProductsDto } from '../application/dto/search-products.dto';
import { SearchPosProductsDto } from '../application/dto/search-pos-products.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsPosService: ProductsPosService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.productsService.search({
      query: query.query || '',
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 10,
      priceListId: query.priceListId,
    });
  }

  @Get('search')
  async search(@Query() searchDto: SearchProductsDto) {
    return this.productsService.search(searchDto);
  }

  /**
   * Endpoint optimizado para búsqueda en POS
   * Requiere priceListId y opcionalmente branchId para stock
   */
  @Get('pos/search')
  async searchForPos(@Query() searchDto: SearchPosProductsDto) {
    const data = await this.productsPosService.searchForPos(searchDto);
    return {
      success: true,
      ...data,
    };
  }

  @Get(':id/stocks')
  async stocks(@Param('id') id: string) {
    return this.productsService.getStocks(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
