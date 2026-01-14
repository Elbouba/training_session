import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Créer la connexion Neon via le pool PG
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Créer l'adaptateur requis par Prisma 7
    const adapter = new PrismaPg(pool);
    
    // 3. Passer l'adaptateur au constructeur
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma 7 : Connecté à Neon avec succès !');
    } catch (error) {
      console.error('❌ Erreur de connexion au démarrage :', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}