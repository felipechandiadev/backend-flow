import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { PriceList, PriceListType } from '../domain/price-list.entity';

@Injectable()
export class PriceListsService {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListRepository: Repository<PriceList>,
  ) {}

  async getAllPriceLists(includeInactive: boolean) {
    const query = this.priceListRepository.createQueryBuilder('priceList');

    if (!includeInactive) {
      query.where('priceList.isActive = :isActive', { isActive: true });
    }

    const priceLists = await query.orderBy('priceList.priority', 'ASC').addOrderBy('priceList.name', 'ASC').getMany();

    return priceLists.map((priceList) => this.mapPriceList(priceList));
  }

  async getPriceListById(id: string) {
    const priceList = await this.priceListRepository.findOne({ where: { id } });
    if (!priceList) {
      return null;
    }
    return this.mapPriceList(priceList);
  }

  async createPriceList(data: {
    name: string;
    priceListType: PriceListType | string;
    currency?: string;
    validFrom?: Date | string;
    validUntil?: Date | string;
    priority?: number;
    isDefault?: boolean;
    isActive?: boolean;
    description?: string | null;
  }) {
    const priceList = this.priceListRepository.create({
      name: data.name,
      priceListType: data.priceListType as PriceListType,
      currency: data.currency ?? 'CLP',
      validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
      validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      priority: data.priority ?? 0,
      isDefault: !!data.isDefault,
      isActive: data.isActive !== false,
      description: data.description ?? undefined,
    } as DeepPartial<PriceList>);

    const saved = await this.priceListRepository.save(priceList);
    const created = await this.getPriceListById(saved.id);

    return { success: true, priceList: created };
  }

  async updatePriceList(
    id: string,
    data: Partial<{
      name: string;
      priceListType: PriceListType | string;
      currency: string;
      validFrom?: Date | string | null;
      validUntil?: Date | string | null;
      priority: number;
      isDefault: boolean;
      isActive: boolean;
      description: string | null;
    }>,
  ) {
    const updateData: any = { ...data };

    if (updateData.priceListType) {
      updateData.priceListType = updateData.priceListType as PriceListType;
    }
    if (updateData.validFrom) {
      updateData.validFrom = new Date(updateData.validFrom);
    }
    if (updateData.validUntil) {
      updateData.validUntil = new Date(updateData.validUntil);
    }

    await this.priceListRepository.update(id, updateData);
    const updated = await this.getPriceListById(id);

    if (!updated) {
      return { success: false, message: 'Price list not found', statusCode: 404 };
    }

    return { success: true, priceList: updated };
  }

  async deletePriceList(id: string) {
    const result = await this.priceListRepository.softDelete(id);
    if (!result.affected) {
      return { success: false, message: 'Price list not found', statusCode: 404 };
    }
    return { success: true };
  }

  private mapPriceList(priceList: PriceList) {
    return {
      id: priceList.id,
      name: priceList.name,
      priceListType: priceList.priceListType,
      currency: priceList.currency,
      validFrom: priceList.validFrom,
      validUntil: priceList.validUntil,
      priority: priceList.priority,
      isDefault: priceList.isDefault,
      isActive: priceList.isActive,
      description: priceList.description ?? null,
      createdAt: priceList.createdAt,
      updatedAt: priceList.updatedAt,
    };
  }
}
