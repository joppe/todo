import type { Result } from "../../shared/Result.ts";
import { success, fail } from "../../shared/Result.ts";

/**
 * Tag name validation regex.
 * Allows alphanumeric characters and hyphens only.
 */
const TAG_NAME_REGEX = /^[a-zA-Z0-9-]+$/;

/**
 * Maximum tag name length.
 */
export const MAX_TAG_LENGTH = 20;

/**
 * Validates a tag name according to the rules:
 * - Max 20 characters
 * - Alphanumeric and hyphens only
 * - Cannot be empty
 * 
 * @param name - Tag name to validate
 * @returns Result with validated lowercase tag name or error
 */
export function validateTagName(name: string): Result<string> {
  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return fail("Tag name cannot be empty");
  }
  
  if (trimmed.length > MAX_TAG_LENGTH) {
    return fail(`Tag name cannot exceed ${MAX_TAG_LENGTH} characters`);
  }
  
  if (!TAG_NAME_REGEX.test(trimmed)) {
    return fail("Tag name must contain only alphanumeric characters and hyphens");
  }
  
  // Return lowercase for storage (normalized)
  return success(trimmed.toLowerCase());
}

/**
 * Parses comma-separated tags and validates each one.
 * Removes duplicates and returns normalized (lowercase) tag names.
 * 
 * @param input - Comma-separated tag string (e.g., "urgent,backend,api")
 * @returns Result with array of validated tag names or error
 */
export function parseTagsInput(input: string): Result<ReadonlyArray<string>> {
  const tagNames = input
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  
  if (tagNames.length === 0) {
    return fail("No valid tags provided");
  }
  
  const validatedTags: string[] = [];
  
  for (const tagName of tagNames) {
    const result = validateTagName(tagName);
    if (!result.success) {
      return fail(`Invalid tag "${tagName}": ${result.error}`);
    }
    validatedTags.push(result.value);
  }
  
  // Remove duplicates
  const uniqueTags = [...new Set(validatedTags)];
  
  return success(uniqueTags);
}

/**
 * Normalizes a tag name to lowercase for storage.
 * 
 * @param name - Tag name to normalize
 * @returns Normalized (lowercase) tag name
 */
export function normalizeTagName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Checks if a tag name is valid without returning a Result.
 * Useful for quick validation checks.
 * 
 * @param name - Tag name to check
 * @returns True if the tag name is valid
 */
export function isValidTagName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 &&
    trimmed.length <= MAX_TAG_LENGTH &&
    TAG_NAME_REGEX.test(trimmed);
}
