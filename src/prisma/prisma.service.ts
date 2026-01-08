import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from 'src/generated/prisma/client';
 import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class PrismaService extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy 
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL est manquant dans les variables d\'environnement');
    }

    // Créer un pool de connexions PostgreSQL
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ 
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });

    console.log(' Configuration Prisma avec adaptateur PostgreSQL');
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log(' Connecté à PostgreSQL avec succès');
    } catch (error) {
      console.error(' Échec de connexion à PostgreSQL:', error);
      
      // Message d'erreur plus détaillé
      if (error.code === 'ECONNREFUSED') {
        console.error('\n📌 Vérifiez que:');
        console.error('1. PostgreSQL est démarré');
        console.error('2. L\'URL DATABASE_URL est correcte dans .env');
        console.error('3. Le port 5432 est accessible');
        console.error('4. L\'utilisateur/mot de passe sont corrects');
      }
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Déconnecté de PostgreSQL');
  }

  // Méthode utilitaire pour vérifier la connexion
  async checkConnection(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}