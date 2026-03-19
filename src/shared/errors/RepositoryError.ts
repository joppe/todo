/**
 * Base error class for repository/database errors.
 * These represent infrastructure-level problems.
 */
export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepositoryError";
  }
}

/**
 * Error thrown when a database connection fails.
 */
export class ConnectionError extends RepositoryError {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionError";
  }
}

/**
 * Error thrown when a database query fails.
 */
export class QueryError extends RepositoryError {
  constructor(message: string) {
    super(message);
    this.name = "QueryError";
  }
}
