import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Create a user
  async createUser(data: { name: string; email: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  // Get all users
  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  // Get a single user by ID
  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Update a user by ID
  async updateUser(id: number, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete a user by ID
  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
