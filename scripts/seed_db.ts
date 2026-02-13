

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../src/infrastructure/database/drizzle/db';
import { clients } from '../src/infrastructure/database/drizzle/schema';
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';

async function seed() {
    const dataPath = path.join(process.cwd(), 'src/infrastructure/database/seeds/clients_data.json');
    if (!fs.existsSync(dataPath)) {
        console.error('Seed data not found:', dataPath);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const clientsData = JSON.parse(rawData);

    console.log(`Found ${clientsData.length} records to seed.`);

    let success = 0;
    let failed = 0;
    let skipped = 0;
    let updated = 0;

    for (const client of clientsData) {
        try {
            // Check if exists by email
            const existing = await db.select().from(clients).where(eq(clients.email, client.email)).limit(1);

            const payload: any = {
                ...client,
                createdAt: client.createdAt ? new Date(client.createdAt) : new Date(),
                updatedAt: new Date(), // Always update updated_at on sync
                // Ensure dates are parsed
                birthDate: client.birthDate ? new Date(client.birthDate).toISOString() : null,
            };

            if (existing.length > 0) {
                // Update existing
                await db.update(clients)
                    .set({
                        fullName: payload.fullName,
                        phone: payload.phone || existing[0].phone,
                        cpf: payload.cpf || existing[0].cpf,
                        addressNeighborhood: payload.addressNeighborhood || existing[0].addressNeighborhood,
                        addressCity: payload.addressCity || existing[0].addressCity,
                        profession: payload.profession || existing[0].profession,
                        lifeCycleStage: payload.lifeCycleStage || existing[0].lifeCycleStage,
                        updatedAt: new Date()
                    } as any) // Type casting for simplicity with dynamic payload
                    .where(eq(clients.email, client.email));
                updated++;
            } else {
                // Insert new
                await db.insert(clients).values(payload as any);
                success++;
            }
        } catch (e) {
            console.error(`Failed to process ${client.email}:`, e);
            failed++;
        }
    }

    console.log(`
    Seed Complete!
    Created: ${success}
    Updated: ${updated}
    Failed: ${failed}
    `);

    process.exit(0);
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});
