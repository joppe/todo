import type { DeleteTodoUseCase } from "../../application/usecases/deleteTodo.ts";
import { createTodoId } from "../../domain/types/TodoId.ts";
import { success as successColor, error as errorColor } from "../../infrastructure/cli/formatters/colorFormatter.ts";

/**
 * Command handler type for deleting todos.
 */
export type DeleteCommandHandler = (options: void, id: string) => Promise<void>;

/**
 * Creates the delete command handler.
 * 
 * @param useCase - DeleteTodoUseCase for business logic
 * @returns Command handler function
 */
export function createDeleteCommand(useCase: DeleteTodoUseCase): DeleteCommandHandler {
  return async function deleteCommand(options: void, id: string): Promise<void> {
    // Parse and validate todo ID
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      console.error(errorColor(`Error: Invalid todo ID "${id}"`));
      Deno.exit(1);
    }

    const todoIdResult = createTodoId(numId);
    if (!todoIdResult.success) {
      console.error(errorColor(`Error: ${todoIdResult.error}`));
      Deno.exit(1);
    }

    // Execute use case
    const result = await useCase(todoIdResult.value);

    if (!result.success) {
      console.error(errorColor(`Error: ${result.error}`));
      Deno.exit(1);
    }

    console.log(successColor(`✓ Todo ${id} deleted`));
  };
}
