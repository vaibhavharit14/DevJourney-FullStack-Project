import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { entrySchema } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entry = await prisma.entry.findUnique({
      where: { id: params.id },
      include: {
        tags: true,
        project: true,
        resources: true,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch entry" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validated = entrySchema.parse(body);

    const updated = await prisma.entry.update({
      where: { id: params.id },
      data: {
        title: validated.title,
        date: validated.date,
        body: validated.body,
        projectId: validated.projectId || null,
        tags: {
          set: [], // Clear existing relations
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

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to update entry" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.entry.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}