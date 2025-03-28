import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
<<<<<<< HEAD
import { AuthenticatedRequest } from '../auth/request.interface';
=======
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
<<<<<<< HEAD
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }
=======
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Token manquant');
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
<<<<<<< HEAD
      request.userId = payload.userId; // Ajouté pour l'accès ultérieur
=======
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
<<<<<<< HEAD

  private extractToken(request: AuthenticatedRequest): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
=======
}
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
