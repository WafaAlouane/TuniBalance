import { Controller, Get,Delete, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { Permissions} from '../auth/decorators/permissions.decorator';
import { UsersService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { Permission } from '../auth/enums/permission.enum';
@Controller('users')
<<<<<<< HEAD
@UseGuards(AuthGuard, RolesGuard)
=======

>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
<<<<<<< HEAD
  @Permissions(Permission.READ_USER)
 
=======
  @Permissions(Permission.READ_USER) // Tu peux aussi garder cette permission si tu veux
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete(':id')
<<<<<<< HEAD
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
=======
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
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
}