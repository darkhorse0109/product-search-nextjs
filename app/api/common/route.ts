import { withDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// get all patterns
export async function POST(req: NextRequest) {
  try {
    const { user_id } = await req.json();
    const queryStr = `SELECT * FROM patterns WHERE user_id = ?`;

    const patterns = await withDatabase(async (db) => {
      const [result] = await db.query(queryStr, [user_id]);
      return result;
    });

    return NextResponse.json({ patterns }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/common: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}