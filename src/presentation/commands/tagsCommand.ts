import type { ListTagsUseCase } from "../../application/usecases/listTags.ts";
import type { RenameTagUseCase } from "../../application/usecases/renameTag.ts";
import type { DeleteTagUseCase } from "../../application/usecases/deleteTag.ts";
import { createTagTable } from "../../infrastructure/cli/formatters/tableFormatter.ts";
import { success as successColor, error as errorColor } from "../../infrastructure/cli/formatters/colorFormatter.ts";

/**
 * Command handler type for listing tags.
 */
export type TagsListCommandHandler = () => Promise<void>;

/**
 * Command handler type for renaming a tag.
 */
export type TagsRenameCommandHandler = (options: void, oldName: string, newName: string) => Promise<void>;

/**
 * Command handler type for deleting a tag.
 */
export type TagsDeleteCommandHandler = (options: void, name: string) => Promise<void>;

/**
 * Creates the tags list command handler.
 * 
 * @param useCase - ListTagsUseCase for business logic
 * @returns Command handler function
 */
export function createTagsListCommand(useCase: ListTagsUseCase): TagsListCommandHandler {
  return async function tagsListCommand(): Promise<void> {
    const result = await useCase();

    if (!result.success) {
      console.error(errorColor(`Error: ${result.error}`));
      Deno.exit(1);
    }

    console.log(createTagTable(result.value));
  };
}

/**
 * Creates the tags rename command handler.
 * 
 * @param useCase - RenameTagUseCase for business logic
 * @returns Command handler function
 */
export function createTagsRenameCommand(useCase: RenameTagUseCase): TagsRenameCommandHandler {
  return async function tagsRenameCommand(options: void, oldName: string, newName: string): Promise<void> {
    const result = await useCase(oldName, newName);

    if (!result.success) {
      console.error(errorColor(`Error: ${result.error}`));
      Deno.exit(1);
    }

    console.log(successColor(`✓ Tag "${oldName}" renamed to "${newName}"`));
  };
}

/**
 * Creates the tags delete command handler.
 * 
 * @param useCase - DeleteTagUseCase for business logic
 * @returns Command handler function
 */
export function createTagsDeleteCommand(useCase: DeleteTagUseCase): TagsDeleteCommandHandler {
  return async function tagsDeleteCommand(options: void, name: string): Promise<void> {
    const result = await useCase(name);

    if (!result.success) {
      console.error(errorColor(`Error: ${result.error}`));
      Deno.exit(1);
    }

    console.log(successColor(`✓ Tag "${name}" deleted`));
  };
}
