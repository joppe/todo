import type { TodoRepository } from "../../domain/repository.ts";
import type { Result } from "../../shared/Result.ts";
import { fail, success } from "../../shared/Result.ts";
import { validateTagName } from "../../domain/types/Tag.ts";

/**
 * Use case function type for renaming a tag globally.
 */
export type RenameTagUseCase = (oldName: string, newName: string) => Promise<Result<void>>;

/**
 * Creates the renameTag use case.
 * Renames a tag across all todos that use it.
 * 
 * @param repository - TodoRepository for persistence
 * @returns RenameTagUseCase function
 * 
 * @example
 * const renameTag = createRenameTagUseCase(repository);
 * const result = await renameTag("urgent", "high-priority");
 */
export function createRenameTagUseCase(
  repository: TodoRepository,
): RenameTagUseCase {
  return async function renameTag(oldName: string, newName: string): Promise<Result<void>> {
    // Validate old tag name
    const oldValidation = validateTagName(oldName);
    if (!oldValidation.success) {
      return fail(`Invalid old tag name: ${oldValidation.error}`);
    }

    // Validate new tag name
    const newValidation = validateTagName(newName);
    if (!newValidation.success) {
      return fail(`Invalid new tag name: ${newValidation.error}`);
    }

    // Check if old tag exists
    const allTagsResult = await repository.getAllTags();
    if (!allTagsResult.success) {
      return fail(`Failed to check existing tags: ${allTagsResult.error}`);
    }

    const oldNameLower = oldName.toLowerCase();
    if (!allTagsResult.value.some(tag => tag.toLowerCase() === oldNameLower)) {
      return fail(`Tag "${oldName}" does not exist`);
    }

    // Check if new tag name conflicts with existing tag
    const newNameLower = newName.toLowerCase();
    if (allTagsResult.value.some(tag => tag.toLowerCase() === newNameLower)) {
      return fail(`Tag "${newName}" already exists`);
    }

    // Rename the tag
    const renameResult = await repository.renameTag(oldName, newName);
    if (!renameResult.success) {
      return fail(`Failed to rename tag: ${renameResult.error}`);
    }

    return success(undefined);
  };
}
