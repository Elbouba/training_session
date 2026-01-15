import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  
  secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY_123', 
});
  }

 
  async validate(payload: any) {
    // Si tu n'as pas de payload, le token est invalide
    if (!payload) {
      throw new UnauthorizedException();
    }
    
    // Ce que tu retournes ici sera mis dans request.user
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role // C'est ici qu'on récupère le rôle ADMIN pour le RolesGuard
    };
  }
}