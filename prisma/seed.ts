import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Upsert Tags
  const tagNames = ["React", "TypeScript", "Next.js", "Prisma", "Tailwind", "Backend", "Frontend", "Fullstack", "Performance", "Clean Code"];
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: "BuildDevLog",
      description: "A fullstack developer learning journal and project tracker built with Next.js 15 and Prisma.",
      status: "Building",
      liveUrl: "https://devlog-intern.vercel.app",
      repoLink: "https://github.com/intern/devlog",
      tags: {
        connect: [{ name: "Next.js" }, { name: "Prisma" }, { name: "Fullstack" }],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "NeoWallet",
      description: "A secure, decentralized cryptocurrency wallet with a focus on ease of use and modern aesthetics.",
      status: "Idea",
      repoLink: "https://github.com/intern/neowallet",
      tags: {
        connect: [{ name: "TypeScript" }, { name: "Backend" }],
      },
    },
  });

  // Create Entries
  await prisma.entry.create({
    data: {
      title: "Setting up Next.js 15 and Prisma",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      body: "Today I initialized the BuildDevLog project using Next.js 15. The new App Router patterns are quite powerful. I also integrated Prisma with SQLite for a zero-config database setup.",
      projectId: project1.id,
      tags: {
        connect: [{ name: "Next.js" }, { name: "Prisma" }],
      },
    },
  });

  await prisma.entry.create({
    data: {
      title: "Mastering React Query for Server State",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      body: "Successfully integrated React Query to handle all API state. The performance boost from caching is noticeable. No more manual useEffect data fetching!",
      projectId: project1.id,
      tags: {
        connect: [{ name: "React" }, { name: "Performance" }],
      },
    },
  });

  await prisma.entry.create({
    data: {
      title: "Design System and Glassmorphism",
      date: new Date(),
      body: "Focused on the UI today. Implemented a custom design system with Tailwind CSS variables. The glassmorphism effects on the cards look really premium.",
      projectId: project1.id,
      tags: {
        connect: [{ name: "Tailwind" }, { name: "Frontend" }],
      },
    },
  });

  // Create Resources
  await prisma.resource.create({
    data: {
      title: "Next.js 15 Release Notes",
      url: "https://nextjs.org/blog/next-15",
      category: "Docs",
      isRead: true,
      isFavorite: true,
      projectId: project1.id,
    },
  });

  await prisma.resource.create({
    data: {
      title: "Prisma Relations Guide",
      url: "https://www.prisma.io/docs/orm/prisma-schema/data-model/relations",
      category: "Docs",
      isRead: false,
      projectId: project1.id,
    },
  });

  await prisma.resource.create({
    data: {
      title: "Advanced Tailwind Patterns",
      url: "https://tailwindcss.com/docs/reusing-styles",
      category: "Article",
      isRead: true,
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
