import type { TodoRepository } from "../data-access/TodoRepository.ts";

export type MakeDeleteTodoProps = {
  todoRepository: TodoRepository;
};

export type DeleteTodo = (id: string) => Promise<void>;

export function makeDeleteTodo({
  todoRepository,
}: MakeDeleteTodoProps): DeleteTodo {
  return async function deleteTodo(id: string): Promise<void> {
    try {
      await todoRepository.remove(id);
    } catch (_) {
      throw new Error("Failed to delete todo");
    }
  };
}
