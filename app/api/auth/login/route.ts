import { withDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { comparePassword } from "@/lib/utils";
import { sign } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const queryStr = `SELECT * FROM users WHERE email = ?`;

    // Use scoped database connection with garbage collection
    const user = await withDatabase(async (db) => {
      const [rows]: any = await db.query(queryStr, [email]);
      return rows.length === 1 ? rows[0] : null;
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email" });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" });
    }

    // Generate access and refresh tokens
    const accessToken = sign(
      { user_id: user.id, user_email: user.email },
      process.env.ACCESS_TOKEN_SECRET || "access_token_secret",
      { expiresIn: 24 * 60 * 60 }
    );

    const refreshToken = sign(
      { user_id: user.id, user_email: user.email },
      process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret",
      { expiresIn: 7 * 24 * 60 * 60 }
    );

    return NextResponse.json({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Error in POST /api/login: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
