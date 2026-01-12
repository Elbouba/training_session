import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (private readonly prisma: PrismaService, private readonly jwtService: JwtService){}
  
    async login(email:string, password:string ) {
       const user = await this.prisma.user.findUnique({
         where: { email },
       });
       if (!user) {
        throw new UnauthorizedException('Email ou mot de passe d\'incorrect');
       }

       const isPasswordValid = await bcrypt.compare(password, user.password);
          if(!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe d\'incorrect');   }  

      const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload);
      return {
      message: 'Connexion réussie',
      access_token,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
      },
    };
  }
}