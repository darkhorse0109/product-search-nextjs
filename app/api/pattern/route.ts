import { withDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// add a new pattern
export async function POST(req: NextRequest) {
  try {
    const { id, user_id, name, value } = await req.json();

    const queryStr = `
        INSERT INTO patterns 
          (id, user_id, name, value) 
        VALUES
          (?, ?, ?, ?)
      `;

    await withDatabase(async (db) => {
      await db.execute(queryStr, [id, user_id, name, value]);
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error in POST /api/pattern: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

// delete a pattern
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const queryStr = `DELETE FROM patterns WHERE id = ?`;

    await withDatabase(async (db) => {
      await db.query(queryStr, [id]);
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/common: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

// update a pattern
export async function PUT(req: NextRequest) {
  try {
    const {
      pattern: { id, name, value },
    } = await req.json();

    const queryStr = `UPDATE patterns SET name = ?, value = ? WHERE id = ?`;

    await withDatabase(async (db) => {
      await db.query(queryStr, [name, value, id]);
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/pattern: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
