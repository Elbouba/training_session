const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();


const connectionString = process.env.DATABASE_URL;

async function createAdmin() {
    const client = new Client({ connectionString });
    
    try {
        await client.connect();
        console.log(' Connecté à la base de données Neon...');

        const email = 'elboubacar947@gmail.com';
        const firstName = 'Diallo';
        const lastName = 'Bouba';
        const phone = '624137886';
        const role = 'ADMIN';
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const id = 'admin-unique-id-' + Date.now(); 

    
        const query = `
            INSERT INTO "User" ("id", "email", "firstName", "lastName", "password", "phone", "role", "isActive", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
            ON CONFLICT ("email") DO NOTHING;
        `;

        await client.query(query, [id, email, firstName, lastName, hashedPassword, phone, role]);

        console.log('SUCCÈS : L\'admin a été inséré directement en SQL !');
        console.log('Email:', email);
        console.log('Mot de passe:', 'admin123');

    } catch (err) {
        console.error(' ERREUR SQL :', err.message);
    } finally {
        await client.end();
    }
}

createAdmin();