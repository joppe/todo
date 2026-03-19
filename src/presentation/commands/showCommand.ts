import type { GetTodoByIdUseCase } from "../../application/usecases/getTodoById.ts";
import { createTodoId } from "../../domain/types/TodoId.ts";
import { toDto } from "../../application/dtos/TodoDto.ts";
import { createTodoDetails } from "../../infrastructure/cli/formatters/tableFormatter.ts";
import { error as errorColor } from "../../infrastructure/cli/formatters/colorFormatter.ts";

/**
 * Command handler type for showing a todo.
 */
export type ShowCommandHandler = (options: void, id: string) => Promise<void>;

/**
 * Creates the show command handler.
 * 
 * @param useCase - GetTodoByIdUseCase for business logic
 * @returns Command handler function
 */
export function createShowCommand(useCase: GetTodoByIdUseCase): ShowCommandHandler {
  return async function showCommand(options: void, id: string): Promise<void> {
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

    const dto = toDto(result.value);
    console.log(createTodoDetails(dto));
  };
}
