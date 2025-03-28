import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../auth/enums/role.enum';
import { ROLES_KEY } from '../auth/decorators/roles.decorator';

<<<<<<< HEAD
=======
// ✅ Nouveau code corrigé :
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());
<<<<<<< HEAD
    const { user } = context.switchToHttp().getRequest();

    if (user.role === UserRole.ADMIN) return true;

    if (user.role === UserRole.BUSINESS_OWNER) {
      return requiredRoles.some(role => 
        [UserRole.FINANCIER, UserRole.ACCOUNTANT].includes(role)
      );
    }

    return requiredRoles?.includes(user.role) ?? true;
=======
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
  }
}