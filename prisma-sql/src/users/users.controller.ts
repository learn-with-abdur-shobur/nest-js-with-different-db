import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a user
  @Post()
  async createUser(@Body() body: { name: string; email: string }) {
    return this.usersService.createUser(body);
  }

  // Get all users
  @Get()
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }

  // Get a single user by ID
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(Number(id));
  }

  // Update a user by ID
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string },
  ) {
    return this.usersService.updateUser(Number(id), body);
  }

  // Delete a user by ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}
