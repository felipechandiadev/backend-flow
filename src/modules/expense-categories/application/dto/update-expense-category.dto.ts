import { CreateExpenseCategoryDto } from './create-expense-category.dto';

export class UpdateExpenseCategoryDto implements Partial<CreateExpenseCategoryDto> {
  companyId?: string;
  code?: string;
  name?: string;
  groupName?: string;
  description?: string;
  requiresApproval?: boolean;
  approvalThreshold?: number;
  defaultResultCenterId?: string;
  isActive?: boolean;
  examples?: string[];
  metadata?: Record<string, unknown>;
}
