import type { TodoRepository, TagInfo } from "../../domain/repository.ts";
import type { Result } from "../../shared/Result.ts";
import { fail } from "../../shared/Result.ts";

/**
 * Use case function type for listing all tags with counts.
 */
export type ListTagsUseCase = () => Promise<Result<readonly TagInfo[]>>;

/**
 * Creates the listTags use case.
 * Returns all tags with their usage counts, sorted by count descending.
 * 
 * @param repository - TodoRepository for data access
 * @returns ListTagsUseCase function
 * 
 * @example
 * const listTags = createListTagsUseCase(repository);
 * const result = await listTags();
 * // Returns: [{ name: "urgent", displayName: "urgent", count: 5 }, ...]
 */
export function createListTagsUseCase(
  repository: TodoRepository,
): ListTagsUseCase {
  return async function listTags(): Promise<Result<readonly TagInfo[]>> {
    const result = await repository.getAllTagsWithCounts();
    if (!result.success) {
      return fail(`Failed to list tags: ${result.error}`);
    }

    // Sort by count descending, then by name alphabetically
    const sortedTags = [...result.value].sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });

    return { success: true, value: sortedTags };
  };
}
