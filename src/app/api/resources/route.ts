import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resourceSchema } from "@/lib/validations";

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      include: { tags: true },
    });
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = resourceSchema.parse(body);

    const resource = await prisma.resource.create({
      data: {
        url: validated.url,
        title: validated.title,
        category: validated.category,
        notes: validated.notes || null,
        isRead: validated.isRead,
        isFavorite: validated.isFavorite,
        entryId: validated.entryId || null,
        projectId: validated.projectId || null,
        tags: {
          connectOrCreate: validated.tags?.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: { tags: true },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create resource" }, { status: 500 });
  }
}
