import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { startOfWeek, subWeeks, format, isSameDay } from "date-fns";

export async function GET() {
  try {
    const [entryCount, projectCount, resourceCount] = await Promise.all([
      prisma.entry.count(),
      prisma.project.count(),
      prisma.resource.count(),
    ]);

    // Activity Chart (Last 8 weeks)
    const weeks = Array.from({ length: 8 }).map((_, i) => {
      const date = subWeeks(startOfWeek(new Date()), i);
      return {
        start: date,
        label: format(date, "MMM d"),
        count: 0,
      };
    }).reverse();

    const entries = await prisma.entry.findMany({
      where: {
        date: {
          gte: weeks[0].start,
        },
      },
      select: { date: true },
    });

    const activityData = weeks.map(week => {
      const count = entries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= week.start && entryDate < subWeeks(week.start, -1);
      }).length;
      return { name: week.label, count };
    });

    // Streak logic (extremely basic for now)
    const allEntries = await prisma.entry.findMany({
      orderBy: { date: "desc" },
      select: { date: true },
    });

    let streak = 0;
    if (allEntries.length > 0) {
      let current = new Date();
      let lastDate: string | null = null;
      
      for (const entry of allEntries) {
        const entryDate = format(new Date(entry.date), "yyyy-MM-dd");
        const currentDateStr = format(current, "yyyy-MM-dd");

        if (entryDate === currentDateStr) {
          if (lastDate !== entryDate) {
            streak++;
            lastDate = entryDate;
            current.setDate(current.getDate() - 1);
          }
        } else if (new Date(entryDate) < new Date(currentDateStr)) {
          break;
        }
      }
    }

    // Top Tags
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { entries: true, projects: true },
        },
      },
    });

    const topTags = tags
      .map(t => ({
        name: t.name,
        count: t._count.entries + t._count.projects,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      counts: { entries: entryCount, projects: projectCount, resources: resourceCount },
      activity: activityData,
      streak,
      topTags,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
