import { IsString, IsOptional, IsNumber, IsBoolean, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsOptional()
  @IsUUID()
  resultCenterId?: string;
}
