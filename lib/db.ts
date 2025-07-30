import mysql, { Connection } from "mysql2/promise";
import { env } from "@/lib/config";

export async function withDatabase<T>(
  callback: (db: Connection) => Promise<T>
): Promise<T> {
  let db: Connection | null = null;

  try {
    db = await mysql.createConnection({
      host: env.DB_HOST as string,
      user: env.DB_USER as string,
      password: env.DB_PASSWORD as string,
      database: env.DB_NAME as string,
    });

    // Initialize the database if needed
    await initializeDatabase(db);

    // Execute the callback function with the connection
    return await callback(db);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    // Ensure the connection is always closed
    if (db) {
      await db.end();
    }
  }
}

async function initializeDatabase(db: Connection) {
  // create 'patterns' table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS patterns (
      id VARCHAR(255) PRIMARY KEY NOT NULL,
      name VARCHAR(255) NOT NULL,
      value LONGTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
}
