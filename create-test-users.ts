import { db } from './server/db';
import { users } from './server/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function createTestUsers() {
  console.log('🔐 Creating test users for Rodada 33...\n');
  
  const testUsers = [
    {
      email: 'admin@orquestrador.local',
      password: 'Admin@2024',
      name: 'Admin Test User',
      role: 'admin',
    },
    {
      email: 'user@orquestrador.local',
      password: 'User@2024',
      name: 'Regular Test User',
      role: 'user',
    },
  ];

  for (const userData of testUsers) {
    try {
      // Check if user exists
      const existing = await db.select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);

      if (existing.length > 0) {
        console.log(`✓ User ${userData.email} already exists (ID: ${existing[0].id})`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role,
      });

      console.log(`✓ Created ${userData.role} user: ${userData.email}`);
      console.log(`  Password: ${userData.password}`);
      console.log(`  ID: ${newUser.insertId}\n`);
    } catch (error) {
      console.error(`✗ Failed to create ${userData.email}:`, error);
    }
  }

  console.log('\n📋 Test Credentials Summary:');
  console.log('─'.repeat(50));
  console.log('Admin User:');
  console.log('  Email: admin@orquestrador.local');
  console.log('  Password: Admin@2024');
  console.log('\nRegular User:');
  console.log('  Email: user@orquestrador.local');
  console.log('  Password: User@2024');
  console.log('─'.repeat(50));
}

createTestUsers()
  .then(() => {
    console.log('\n✅ Test users setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
