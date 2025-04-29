import type { TodoRepository } from "../data-access/TodoRepository.ts";
import type { Todo } from "../entity/Todo.ts";

export type MakeUpdateTodoProps = {
  todoRepository: TodoRepository;
  isValidDate: (date: Date) => boolean;
};

export type Input = Pick<Todo, "title" | "description" | "deadline">;

export type UpdateTodo = (id: string, data: Input) => Promise<void>;

export function makeUpdateTodo({
  todoRepository,
  isValidDate,
}: MakeUpdateTodoProps): UpdateTodo {
  return async function updateTodo(
    id: string,
    { title, description, deadline: date }: Input,
  ): Promise<void> {
    const deadline = date !== null ? new Date(date) : null;

    if (deadline !== null && !isValidDate(deadline)) {
      throw new Error("Invalid deadline");
    }

    try {
      await todoRepository.update(id, {
        title,
        description,
        deadline,
      });
    } catch (_) {
      throw new Error("Failed to update todo");
    }
  };
}
