import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    // On vérifie si le rôle dans le token est bien ADMIN
    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException("Désolé, seul l'administrateur peut effectuer cette action.");
    }

    return true;
  }
}