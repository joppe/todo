/**
 * Result type for operations that can fail.
 * Enables railway-oriented programming.
 * 
 * A Result is either a success containing a value, or a failure containing an error.
 */
export type Result<T, E = string> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Creates a successful result.
 * 
 * @param value - The success value
 * @returns A successful Result
 */
export function success<T, E = string>(value: T): Result<T, E> {
  return { success: true, value };
}

/**
 * Creates a failed result.
 * 
 * @param error - The error value
 * @returns A failed Result
 */
export function fail<T, E = string>(error: E): Result<T, E> {
  return { success: false, error };
}

/**
 * Maps a successful result to a new value.
 * If the result is a failure, returns the failure unchanged.
 * 
 * @param result - The result to map
 * @param fn - The mapping function
 * @returns A new Result with the mapped value or the original error
 */
export function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  if (!result.success) return result;
  return success(fn(result.value));
}

/**
 * Chains operations that return Results.
 * Also known as flatMap or bind in functional programming.
 * 
 * @param result - The result to chain
 * @param fn - The function that returns a new Result
 * @returns The result of the function or the original error
 */
export function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  if (!result.success) return result;
  return fn(result.value);
}

/**
 * Type guard for successful results.
 * 
 * @param result - The result to check
 * @returns True if the result is successful
 */
export function isSuccess<T, E>(
  result: Result<T, E>,
): result is { success: true; value: T } {
  return result.success;
}

/**
 * Type guard for failed results.
 * 
 * @param result - The result to check
 * @returns True if the result is a failure
 */
export function isFailure<T, E>(
  result: Result<T, E>,
): result is { success: false; error: E } {
  return !result.success;
}

/**
 * Extracts the value from a Result or throws if it's a failure.
 * Use with caution - prefer pattern matching on the Result type.
 * 
 * @param result - The result to unwrap
 * @returns The success value
 * @throws Error if the result is a failure
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (!result.success) {
    throw new Error(`Cannot unwrap failed result: ${result.error}`);
  }
  return result.value;
}

/**
 * Extracts the value from a Result or returns a default value.
 * 
 * @param result - The result to unwrap
 * @param defaultValue - The default value to return if the result is a failure
 * @returns The success value or the default value
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (!result.success) return defaultValue;
  return result.value;
}
