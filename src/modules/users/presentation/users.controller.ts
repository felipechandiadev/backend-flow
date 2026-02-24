import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from '../application/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query('search') search?: string) {
    return this.usersService.getAllUsers(search);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      return { success: false, message: 'User not found', statusCode: 404 };
    }
    return user;
  }

  @Post()
  async createUser(
    @Body()
    data: {
      userName: string;
      mail: string;
      password: string;
      rol?: string;
      personId?: string;
      person?: {
        type?: string;
        firstName: string;
        lastName?: string;
        businessName?: string;
        documentType?: string;
        documentNumber?: string;
        email?: string;
        phone?: string;
        address?: string;
      };
    },
  ) {
    return this.usersService.createUser(data);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      userName: string;
      mail: string;
      rol: string;
      phone?: string;
      personName?: string;
      personDni?: string;
    }>,
  ) {
    return this.usersService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() data: { password: string },
  ) {
    return this.usersService.changePassword(id, data.password);
  }

  @Put('password')
  async changeOwnPassword(@Body() data: { currentUserId?: string; newPassword?: string }) {
    return this.usersService.changeOwnPassword(data);
  }
}
