import { type NextRequest, NextResponse } from "next/server";
import { withDatabase } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { user_id, user_balance, consumption } = await req.json();
  const queryStr = `
    UPDATE users
    SET balance = ?
    WHERE id = ?
  `;

  try {
    await withDatabase(async (db) => {
      await db.execute(queryStr, [user_balance - consumption, user_id]);
    })
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error in invoice.payment_succeeded /api/stripe/webhook: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
