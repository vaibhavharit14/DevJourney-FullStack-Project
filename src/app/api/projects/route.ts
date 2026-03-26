import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { projectSchema } from "@/lib/validations";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tags: true,
        _count: {
          select: { entries: true },
        },
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        name: validated.name,
        description: validated.description,
        status: validated.status,
        liveUrl: validated.liveUrl || null,
        repoLink: validated.repoLink || null,
        tags: {
          connectOrCreate: validated.tags?.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
