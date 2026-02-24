import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { InventoryService } from '../application/inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('filters')
  async getFilters() {
    return this.inventoryService.getFilters();
  }

  @Get()
  async getInventory(
    @Query() params: { search?: string; branchId?: string; storageId?: string },
  ) {
    return this.inventoryService.search(params);
  }

  @Post('adjust')
  async adjust(@Body() data: any) {
    return this.inventoryService.adjust(data);
  }

  @Post('transfer')
  async transfer(@Body() data: any) {
    return this.inventoryService.transfer(data);
  }
}
