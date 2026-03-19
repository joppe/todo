import type { SearchTodosUseCase } from "../../application/usecases/searchTodos.ts";
import type { Priority } from "../../domain/types/Priority.ts";
import type { TodoStatus } from "../../domain/types/TodoStatus.ts";
import { toDtoArray } from "../../application/dtos/TodoDto.ts";
import { createTodoTable } from "../../infrastructure/cli/formatters/tableFormatter.ts";
import { error as errorColor } from "../../infrastructure/cli/formatters/colorFormatter.ts";

/**
 * Command options for searching todos.
 */
export type SearchCommandOptions = {
  readonly status?: TodoStatus;
  readonly priority?: Priority;
  readonly category?: string;
  readonly tag?: string;
  readonly overdue?: boolean;
};

/**
 * Command handler type for searching todos.
 */
export type SearchCommandHandler = (options: SearchCommandOptions, query: string) => Promise<void>;

/**
 * Creates the search command handler.
 * 
 * @param useCase - SearchTodosUseCase for business logic
 * @returns Command handler function
 */
export function createSearchCommand(useCase: SearchTodosUseCase): SearchCommandHandler {
  return async function searchCommand(
    options: SearchCommandOptions,
    query: string,
  ): Promise<void> {
    const result = await useCase(query, options);

    if (!result.success) {
      console.error(errorColor(`Error: ${result.error}`));
      Deno.exit(1);
    }

    const dtos = toDtoArray(result.value);
    console.log(createTodoTable(dtos));
  };
}
