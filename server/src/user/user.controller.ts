import { Controller, Get,Delete, Param, UseGuards, NotFoundException, Query } from '@nestjs/common';
import { Permissions} from '../auth/decorators/permissions.decorator';
import { UsersService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { Permission } from '../auth/enums/permission.enum';
@Controller('users')

export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Permissions(Permission.READ_USER) // Tu peux aussi garder cette permission si tu veux
  async getAllUsers() {
    return this.usersService.findAll();
  }
  @Get('search')
  @UseGuards(AuthGuard)
  async searchUsers(@Query('term') term: string) {
    return this.usersService.searchByName(term);
  }
  @Get(':id')
@UseGuards(AuthGuard)
async getUserById(@Param('id') id: string) {
  try {
    return await this.usersService.findById(id);
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    }
    throw error;
  }
}
  @Delete(':id')
  @Roles(UserRole.ADMIN) // Seul l'admin peut supprimer un utilisateur
  @UseGuards(AuthGuard, RolesGuard)
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