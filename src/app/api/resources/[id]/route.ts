import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resourceSchema } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validated = resourceSchema.partial().parse(body);

    const { tags, ...rest } = validated;

    const updateData: any = { ...rest };

    if (tags !== undefined) {
      updateData.tags = {
        set: [],
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      };
    }

    const updated = await prisma.resource.update({
      where: { id: params.id },
      data: updateData,
      include: { tags: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.resource.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
