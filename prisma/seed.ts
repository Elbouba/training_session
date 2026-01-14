// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
// import * as dotenv from 'dotenv';

// dotenv.config();

// // Correction ici : "datasource" au lieu de "datasources"
// const prisma = new PrismaClient();

// async function main() {
//   console.log('🚀 Tentative de création de l\'admin...');
  
//   const hashedPassword = await bcrypt.hash('admin123', 10);

//   const admin = await prisma.user.upsert({
//     where: { email: 'elboubacar947@gmail.com' },
//     update: {},
//     create: {
//       email: 'elboubacar947@gmail.com',
//       firstName: 'Diallo',
//       lastName: 'Bouba',
//       password: hashedPassword,
//       role: 'ADMIN',
//     },
//   });

//   console.log('✅ SEED RÉUSSI !');
//   console.log({ admin });
// }

// main()
//   .catch((e) => {
//     console.error('❌ ERREUR LORS DU SEED :');
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });