import { Controller, Get,Delete, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete(':id')
@Roles(UserRole.ADMIN)
async deleteUser(@Param('id') id: string) {
  try {
    return await this.usersService.delete(id);
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    }
    throw error;
  }
}
}