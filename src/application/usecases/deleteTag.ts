import type { TodoRepository } from "../../domain/repository.ts";
import type { Result } from "../../shared/Result.ts";
import { fail, success } from "../../shared/Result.ts";
import { validateTagName } from "../../domain/types/Tag.ts";

/**
 * Use case function type for deleting a tag.
 */
export type DeleteTagUseCase = (name: string) => Promise<Result<void>>;

/**
 * Creates the deleteTag use case.
 * Removes a tag from all todos and deletes it from the system.
 * 
 * @param repository - TodoRepository for persistence
 * @returns DeleteTagUseCase function
 * 
 * @example
 * const deleteTag = createDeleteTagUseCase(repository);
 * const result = await deleteTag("obsolete");
 */
export function createDeleteTagUseCase(
  repository: TodoRepository,
): DeleteTagUseCase {
  return async function deleteTag(name: string): Promise<Result<void>> {
    // Validate tag name
    const validation = validateTagName(name);
    if (!validation.success) {
      return fail(`Invalid tag name: ${validation.error}`);
    }

    // Check if tag exists
    const allTagsResult = await repository.getAllTags();
    if (!allTagsResult.success) {
      return fail(`Failed to check existing tags: ${allTagsResult.error}`);
    }

    const nameLower = name.toLowerCase();
    if (!allTagsResult.value.some(tag => tag.toLowerCase() === nameLower)) {
      return fail(`Tag "${name}" does not exist`);
    }

    // Delete the tag
    const deleteResult = await repository.deleteTag(name);
    if (!deleteResult.success) {
      return fail(`Failed to delete tag: ${deleteResult.error}`);
    }

    return success(undefined);
  };
}
