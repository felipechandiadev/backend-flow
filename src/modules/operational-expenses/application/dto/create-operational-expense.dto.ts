import { IsNotEmpty, IsOptional, IsUUID, IsDateString, IsEnum, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OperationalExpenseStatus } from '../../domain/operational-expense.entity';

export class CreateOperationalExpenseDto {
  @IsNotEmpty()
  @IsUUID()
  companyId!: string;

  @IsOptional()
  @IsUUID()
  branchId?: string;

  @IsOptional()
  @IsUUID()
  resultCenterId?: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  referenceNumber!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  operationDate!: string;

  @IsOptional()
  @IsEnum(OperationalExpenseStatus)
  status?: OperationalExpenseStatus;

  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsNotEmpty()
  @IsUUID()
  createdBy!: string;
}
