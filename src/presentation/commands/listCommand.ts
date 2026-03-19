import type { ListTodosUseCase } from "../../application/usecases/listTodos.ts";
import type { Priority } from "../../domain/types/Priority.ts";
import type { TodoStatus } from "../../domain/types/TodoStatus.ts";
import { toDtoArray } from "../../application/dtos/TodoDto.ts";
import { createTodoTable } from "../../infrastructure/cli/formatters/tableFormatter.ts";
import { error as errorColor } from "../../infrastructure/cli/formatters/colorFormatter.ts";

/**
 * Command options for listing todos.
 */
export type ListCommandOptions = {
  readonly status?: TodoStatus;
  readonly priority?: Priority;
  readonly category?: string;
  readonly tag?: string;
  readonly overdue?: boolean;
};

/**
 * Command handler type for listing todos.
 */
export type ListCommandHandler = (options: ListCommandOptions) => Promise<void>;

/**
 * Creates the list command handler.
 * 
 * @param useCase - ListTodosUseCase for business logic
 * @returns Command handler function
 */
export function createListCommand(useCase: ListTodosUseCase): ListCommandHandler {
  return async function listCommand(options: ListCommandOptions): Promise<void> {
    const result = await useCase(options);

    if (!result.success) {
      console.error(errorColor(`Error: ${result.error}`));
      Deno.exit(1);
    }

    const dtos = toDtoArray(result.value);
    console.log(createTodoTable(dtos));
  };
}
