const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const prisma = new PrismaClient({
        log: ['info', 'warn', 'error'],
    });

    try {
        console.log('Testing Supabase connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

        await prisma.$connect();
        console.log('✅ Connected to Supabase!');

        // Test query
        const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
        console.log('✅ Database info:', result[0]);

    } catch (error) {
        console.error('❌ Connection failed:', error.message);

        if (error.message.includes("Can't reach database server")) {
            console.log('\n🔍 Troubleshooting steps:');
            console.log('1. Check if your Supabase project is PAUSED');
            console.log('2. Verify your DATABASE_URL in .env.local');
            console.log('3. Make sure you\'re using port 6543 (pooler) not 5432');
            console.log('4. Check your database password');
        }
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();