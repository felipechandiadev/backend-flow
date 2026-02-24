import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AccountingPeriodsService } from '../application/accounting-periods.service';
import { AccountingPeriodStatus } from '../domain/accounting-period.entity';

@Controller('accounting/periods')
export class AccountingPeriodsController {
  constructor(
    private readonly accountingPeriodsService: AccountingPeriodsService,
  ) {}

  @Get()
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('status') status?: AccountingPeriodStatus,
    @Query('year') year?: string,
  ) {
    try {
      const params = {
        companyId,
        status,
        year: year ? parseInt(year, 10) : undefined,
      };

      const periods = await this.accountingPeriodsService.findAll(params);

      return {
        success: true,
        data: periods,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const period = await this.accountingPeriodsService.findOne(id);

      if (!period) {
        throw new HttpException(
          {
            success: false,
            message: 'Accounting period not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: period,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    data: {
      companyId?: string;
      startDate: string;
      endDate: string;
      name?: string;
      status?: AccountingPeriodStatus;
    },
  ) {
    try {
      const period = await this.accountingPeriodsService.create(data);

      return {
        success: true,
        data: period,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
        error instanceof Error && error.message.includes('overlaps')
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('ensure')
  @HttpCode(HttpStatus.OK)
  async ensurePeriod(
    @Body() data: { date: string; companyId?: string },
  ) {
    try {
      const period = await this.accountingPeriodsService.ensurePeriod(
        data.date,
        data.companyId,
      );

      return {
        success: true,
        data: period,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/close')
  async closePeriod(
    @Param('id') id: string,
    @Body() data?: { userId?: string },
  ) {
    try {
      const period = await this.accountingPeriodsService.closePeriod(
        id,
        data?.userId,
      );

      return {
        success: true,
        data: period,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
        error instanceof Error && error.message.includes('not found')
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/reopen')
  async reopenPeriod(@Param('id') id: string) {
    try {
      const period = await this.accountingPeriodsService.reopenPeriod(id);

      return {
        success: true,
        data: period,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
        error instanceof Error && error.message.includes('not found')
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST,
      );
    }
  }
}
