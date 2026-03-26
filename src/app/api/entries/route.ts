import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { entrySchema } from "@/lib/validations";

export async function GET() {
  try {
    const entries = await prisma.entry.findMany({
      orderBy: { date: "desc" },
      include: {
        tags: true,
        project: true,
      },
    });
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = entrySchema.parse(body);

    const entry = await prisma.entry.create({
      data: {
        title: validated.title,
        date: validated.date,
        body: validated.body,
        projectId: validated.projectId || null,
        tags: {
          connectOrCreate: validated.tags?.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: {
        tags: true,
        project: true,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create entry" }, { status: 500 });
  }
}
