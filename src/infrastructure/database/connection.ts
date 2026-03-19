import { Database } from "@db/sqlite";
import { join } from "@std/path";

/**
 * Database file name.
 */
const DB_FILE_NAME = "todos.db";

/**
 * Database directory in user's home.
 */
const DB_DIR_NAME = ".todo-cli";

/**
 * Gets the database file path.
 * 
 * @returns Full path to the database file
 */
export function getDatabasePath(): string {
  const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "/tmp";
  return join(homeDir, DB_DIR_NAME, DB_FILE_NAME);
}

/**
 * Ensures the database directory exists.
 * 
 * @returns Path to the database directory
 */
async function ensureDatabaseDirectory(): Promise<string> {
  const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "/tmp";
  const dbDir = join(homeDir, DB_DIR_NAME);

  try {
    await Deno.mkdir(dbDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, which is fine
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  return dbDir;
}

/**
 * Creates and opens a connection to the SQLite database.
 * Ensures the database directory exists and creates the database file if needed.
 * 
 * @returns Database connection
 */
export async function createConnection(): Promise<Database> {
  await ensureDatabaseDirectory();
  const dbPath = getDatabasePath();

  const db = new Database(dbPath);

  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON");

  return db;
}

/**
 * Creates an in-memory database connection for testing.
 * 
 * @returns In-memory database connection
 */
export function createInMemoryConnection(): Database {
  const db = new Database(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  return db;
}
