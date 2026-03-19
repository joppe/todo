import { createConnection } from "./src/infrastructure/database/connection.ts";
import { runMigrations } from "./src/infrastructure/database/migrations.ts";
import { createTodoRepository } from "./src/infrastructure/database/repository.ts";
import { createCli } from "./src/infrastructure/cli/createCli.ts";

/**
 * Application entry point.
 * Sets up dependency injection and starts the CLI.
 */
async function main(): Promise<void> {
  // Initialize database connection
  const db = await createConnection();

  // Run migrations to ensure schema is up to date
  runMigrations(db);

  // Create repository
  const repository = createTodoRepository(db);

  // Create and run CLI
  const cli = createCli(repository);
  await cli.parse(Deno.args);
}

// Run the application
if (import.meta.main) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    Deno.exit(1);
  });
}
