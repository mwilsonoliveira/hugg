import { NextResponse } from "next/server";
import { prisma } from "@hugg/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const tables = await prisma.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM sqlite_master
      WHERE type = 'table' AND name IN ('User', 'AuthAttempt')
    `;
    const userColumns = await prisma.$queryRaw<Array<{ name: string }>>`PRAGMA table_info("User")`;
    const tableNames = new Set(tables.map((table) => table.name));
    const columnNames = new Set(userColumns.map((column) => column.name));
    if (!tableNames.has("User") || !tableNames.has("AuthAttempt") || !columnNames.has("googleSubject")) {
      return NextResponse.json({ status: "error", database: "schema_unavailable" }, { status: 503 });
    }
    return NextResponse.json({ status: "ok", database: "ok" });
  } catch {
    return NextResponse.json({ status: "error", database: "unavailable" }, { status: 503 });
  }
}
