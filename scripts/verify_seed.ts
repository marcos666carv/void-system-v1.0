
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '../src/infrastructure/database/drizzle/db';
import { services, products, locations, tanks } from '../src/infrastructure/database/drizzle/schema';
import { count } from 'drizzle-orm';

async function verify() {
    try {
        const sCount = await db.select({ count: count() }).from(services);
        const pCount = await db.select({ count: count() }).from(products);
        const lCount = await db.select({ count: count() }).from(locations);
        const tCount = await db.select({ count: count() }).from(tanks);

        console.log('--- Verification Results ---');
        console.log(`Services: ${sCount[0].count}`);
        console.log(`Products: ${pCount[0].count}`);
        console.log(`Locations: ${lCount[0].count}`);
        console.log(`Tanks: ${tCount[0].count}`);

        process.exit(0);
    } catch (e) {
        console.error('Verification failed:', e);
        process.exit(1);
    }
}

verify();
