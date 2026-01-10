import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';

  const existing = await prisma.merchant.findUnique({
    where: { email }
  });

  if (existing) {
    console.log('Test merchant already exists');
    return;
  }

  await prisma.merchant.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Test Merchant',
      email: email,
      api_key: 'key_test_abc123',
      api_secret: 'secret_test_xyz789'
    }
  });

  console.log('Test merchant seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
