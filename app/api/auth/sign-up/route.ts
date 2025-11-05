import { withDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hashedPassword } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const queryStr = `SELECT * FROM users WHERE email = ?`;

    // Use scoped database connection with garbage collection
    const user = await withDatabase(async (db) => {
      const [rows]: any = await db.query(queryStr, [email]);
      return rows.length === 1 ? rows[0] : null;
    });

    if (user) {
      return NextResponse.json({ error: "Existing email"})
    }

    const hashPassword = await hashedPassword(password)

    const insertStr = `
      INSERT INTO users 
        (email, password, balance, subscription) 
      VALUES (?, ?, 300, 'Trial')
    `;

    const insertedId = await withDatabase(async (db) => {
      const [result] = await db.execute(insertStr, [
        email,
        hashPassword
      ]);
      return (result as any).id
    });

    return NextResponse.json({ insertedId });
  } catch (error) {
    console.error("Error in POST /api/auth/sign-up: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
