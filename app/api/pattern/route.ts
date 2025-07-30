import { withDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// get all patterns
export async function GET(req: NextRequest) {
  try {
    const queryStr = "SELECT * FROM patterns";

    const patterns = await withDatabase(async (db) => {
      const [result] = await db.query(queryStr);
      return result;
    });

    return NextResponse.json({ patterns }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/pattern: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

// add a new pattern
export async function POST(req: NextRequest) {
  try {
    const { id, name, value } = await req.json();

    const queryStr = `
        INSERT INTO patterns 
          (id, name, value) 
        VALUES
          (?, ?, ?)
      `;

    await withDatabase(async (db) => {
      await db.execute(queryStr, [id, name, value]);
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
    console.error("Error in DELETE /api/pattern: ", error);
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
