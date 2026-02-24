import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PersonsService } from '../application/persons.service';
import { Person, PersonType, PersonBankAccount } from '../domain/person.entity';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get()
  async findAll(
    @Query('term') term?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: PersonType,
    @Query('includeInactive') includeInactive?: string,
  ) {
    try {
      const params = {
        term,
        limit: limit ? parseInt(limit, 10) : undefined,
        type,
        includeInactive: includeInactive === 'true',
      };

      const persons = await this.personsService.findAll(params);
      
      return {
        success: true,
        data: persons,
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
  async findOne(
    @Param('id') id: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    try {
      const person = await this.personsService.findOne(
        id,
        includeInactive === 'true'
      );

      return {
        success: true,
        person,
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
        error instanceof Error && error.message.includes('not found')
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: Partial<Person>) {
    try {
      const person = await this.personsService.create(data);
      
      return {
        success: true,
        person,
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Person>,
  ) {
    try {
      const person = await this.personsService.update(id, data);
      
      return {
        success: true,
        person,
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
        error instanceof Error && error.message.includes('not found')
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      await this.personsService.remove(id);
      
      return {
        success: true,
        message: 'Person deleted successfully',
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
        error instanceof Error && error.message.includes('not found')
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':personId/bank-accounts')
  @HttpCode(HttpStatus.CREATED)
  async addBankAccount(
    @Param('personId') personId: string,
    @Body() accountData: PersonBankAccount,
  ) {
    try {
      const person = await this.personsService.addBankAccount(personId, accountData);
      
      return {
        success: true,
        person,
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
        error instanceof Error && error.message.includes('not found')
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':personId/bank-accounts/:accountKey')
  @HttpCode(HttpStatus.OK)
  async removeBankAccount(
    @Param('personId') personId: string,
    @Param('accountKey') accountKey: string,
  ) {
    try {
      await this.personsService.removeBankAccount(personId, accountKey);
      
      return {
        success: true,
        message: 'Bank account removed successfully',
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
        error instanceof Error && error.message.includes('not found')
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
