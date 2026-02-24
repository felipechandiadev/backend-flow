import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { PaymentMethod, TransactionStatus, TransactionType } from '@modules/transactions/domain/transaction.entity';

export class SearchTransactionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number; // Alias para limit

  @IsOptional()
  filters?: any; // Acepta cualquier cosa - se ignora

  @IsOptional()
  @IsString()
  type?: TransactionType;

  @IsOptional()
  @IsString()
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  pointOfSaleId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  supplierId?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
