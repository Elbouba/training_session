const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'elboubacar947@gmail.com' },
      update: {},
      create: {
        email: 'elboubacar947@gmail.com',
        firstName: 'Diallo',
        lastName: 'Bouba',
        password: hashedPassword,
        phone: '00000000', // Ajouté car présent dans ton schéma
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('✅ ADMIN CRÉÉ AVEC SUCCÈS');
    console.log(admin);
  } catch (error) {
    console.error('❌ ERREUR :', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();