import { withDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { comparePassword } from "@/lib/utils";
import { jwtDecode } from 'jwt-decode';
import { sign, verify } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    let { access_token, refresh_token } = await req.json();
    if (!access_token || !refresh_token) {
      return NextResponse.json({ is_authenticated: false });
    }

    const { exp: accessTokenExp = 0 } = jwtDecode(access_token) || {};
    const { exp: refreshTokenExp = 0 } = jwtDecode(refresh_token) || {};
    const currentTime = Date.now() / 1000;

    if (refreshTokenExp < currentTime) {
      return NextResponse.json({ is_authenticated: false });
    }

    if (accessTokenExp < currentTime) {
      const payload = verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret"
      ) as any;
  
      access_token = sign(
        {
          user_id: payload.user_id,
          user_email: payload.user_email
        },
        process.env.ACCESS_TOKEN_SECRET || "access_token_secret",
        { expiresIn: 24 * 60 * 60 }
      );
    }
    
    const payload = verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET || "access_token_secret"
    ) as any;

    const { user_id, user_email } = payload;

    const user = await withDatabase(async (db) => {
      const queryStr = `SELECT * FROM users WHERE email = ?`;
      const [rows]: any = await db.query(queryStr, [user_email]);
      return rows.length === 1 ? rows[0] : null;
    });

    if (!user) {
      return NextResponse.json({ is_authenticated: false });
    }

    const is_authenticated = user_id === user.id;

    return NextResponse.json({
      user_id,
      user_email,
      user_balance: user.balance,
      user_subscription: user.subscription,
      is_authenticated,
      access_token,
    });
  } catch (error) {
    console.error("Error in POST /api/auth/me: ", error);
    return NextResponse.json( { error }, { status: 500 });
  }
}
