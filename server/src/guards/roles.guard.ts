import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../auth/enums/role.enum';
import { ROLES_KEY } from '../auth/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());
    const { user } = context.switchToHttp().getRequest();

    if (user.role === UserRole.ADMIN) return true;

    if (user.role === UserRole.BUSINESS_OWNER) {
      return requiredRoles.some(role => 
        [UserRole.FINANCIER, UserRole.ACCOUNTANT].includes(role)
      );
    }

    return requiredRoles?.includes(user.role) ?? true;
  }
}