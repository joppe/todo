import type { AddTodoUseCase } from "../../application/usecases/addTodo.ts";
import type { Priority } from "../../domain/types/Priority.ts";
import { parseTagsInput } from "../../domain/types/Tag.ts";
import { success as successColor, error as errorColor } from "../../infrastructure/cli/formatters/colorFormatter.ts";

/**
 * Command options for adding a todo.
 */
export type AddCommandOptions = {
  readonly description?: string;
  readonly priority?: Priority;
  readonly category?: string;
  readonly due?: string;
  readonly tags?: string;
};

/**
 * Command handler type for adding todos.
 */
export type AddCommandHandler = (options: AddCommandOptions, title: string) => Promise<void>;

/**
 * Creates the add command handler.
 * 
 * @param useCase - AddTodoUseCase for business logic
 * @returns Command handler function
 */
export function createAddCommand(useCase: AddTodoUseCase): AddCommandHandler {
  return async function addCommand(
    options: AddCommandOptions,
    title: string,
  ): Promise<void> {
    // Parse tags if provided
    let tags: string[] | undefined;
    if (options.tags) {
      const parseResult = parseTagsInput(options.tags);
      if (!parseResult.success) {
        console.error(errorColor(`Error: ${parseResult.error}`));
        Deno.exit(1);
      }
      tags = [...parseResult.value];
    }

    // Execute use case
    const result = await useCase({
      title,
      description: options.description,
      priority: options.priority,
      category: options.category,
      dueDate: options.due,
      tags,
    });

    if (!result.success) {
      console.error(errorColor(`Error: ${result.error}`));
      Deno.exit(1);
    }

    console.log(successColor(`✓ Todo created with ID ${result.value.id}`));
  };
}
