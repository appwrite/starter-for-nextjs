import { db } from './db';

export async function resetDatabaseConnection() {
    try {
        await db.$disconnect();
        await db.$connect();
    } catch (error) {
        console.error('Database reset failed:', error);
    }
}