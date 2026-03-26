import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  const r = await prisma.resource.findFirst({
    include: { tags: true }
  });
  console.log("Resource with tags:", r);
}

test().catch(console.error).finally(() => prisma.$disconnect());
