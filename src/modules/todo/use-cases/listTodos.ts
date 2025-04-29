import type { TodoRepository } from "../data-access/TodoRepository.ts";
import type { Todo } from "../entity/Todo.ts";

export type MakeListTodosProps = {
  todoRepository: TodoRepository;
};

export type ListTodos = () => Promise<Todo[]>;

export function makeListTodos({
  todoRepository,
}: MakeListTodosProps): ListTodos {
  return async function listTodos(): Promise<Todo[]> {
    try {
      const todos = await todoRepository.findAll();

      return todos;
    } catch (_) {
      throw new Error("Failed to list todos");
    }
  };
}
