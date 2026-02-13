
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Pool } from 'pg';

async function test() {
    console.log('Testing connection with Pool...');
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('No DATABASE_URL found');
        process.exit(1);
    }
    console.log('URL found (masked):', url.replace(/:[^:]*@/, ':****@'));

    const pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        console.log('Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        client.release();
        await pool.end();
        process.exit(0);
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    }
}

test();
