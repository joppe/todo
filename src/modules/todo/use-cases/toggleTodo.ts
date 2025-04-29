import type { TodoRepository } from "../data-access/TodoRepository.ts";
import type { Todo } from "../entity/Todo.ts";

export type MakeToggleTodoProps = {
  todoRepository: TodoRepository;
};

export type ToggleTodo = (id: string) => Promise<Todo>;

export function makeToggleTodo({
  todoRepository,
}: MakeToggleTodoProps): ToggleTodo {
  return async function toggleTodo(id: string): Promise<Todo> {
    try {
      const todo = await todoRepository.toggle(id);

      return todo;
    } catch (_) {
      throw new Error("Failed to toggle todo");
    }
  };
}
