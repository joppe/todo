import type { TodoRepository } from "../data-access/TodoRepository.ts";
import type { Todo } from "../entity/Todo.ts";

export type MakeCreateTodoProps = {
  todoRepository: TodoRepository;
  todoFactory: (data: Todo) => Todo;
  generateId: () => string;
};

export type Input = {
  title: string;
  description?: string;
  deadline?: string;
};

export type CreateTodo = (data: Input) => Promise<Todo>;

export function makeCreateTodo({
  todoRepository,
  todoFactory,
  generateId,
}: MakeCreateTodoProps): CreateTodo {
  return async function createTodo(
    { title, description = "", deadline }: Input,
  ): Promise<Todo> {
    const now = new Date();

    const todo = todoFactory({
      id: generateId(),
      title,
      description: description,
      done: false,
      deadline: deadline !== undefined ? new Date(deadline) : null,
      created: now,
      updated: now,
    });

    try {
      return await todoRepository.insert(todo);
    } catch (_) {
      throw new Error("Failed to create todo");
    }
  };
}
