import type { CompleteTodoUseCase } from "../../application/usecases/completeTodo.ts";
import type { TodoId } from "../../domain/types/TodoId.ts";
import { createTodoId } from "../../domain/types/TodoId.ts";
import { success as successColor, error as errorColor } from "../../infrastructure/cli/formatters/colorFormatter.ts";

/**
 * Command handler type for completing todos.
 */
export type CompleteCommandHandler = (options: void, id: string) => Promise<void>;

/**
 * Creates the complete command handler.
 * 
 * @param useCase - CompleteTodoUseCase for business logic
 * @returns Command handler function
 */
export function createCompleteCommand(useCase: CompleteTodoUseCase): CompleteCommandHandler {
  return async function completeCommand(options: void, id: string): Promise<void> {
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

    console.log(successColor(`✓ Todo ${id} marked as completed`));
  };
}
