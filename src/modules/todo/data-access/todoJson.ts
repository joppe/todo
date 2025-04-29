import type { File } from "../../../gateways/file.ts";
import type { Todo } from "../entity/Todo.ts";
import type { TodoRepository } from "./TodoRepository.ts";

export type MakeTodoJson = {
  file: File;
  generateId: () => string;
};

export type SerializedTodo = Omit<Todo, "created" | "updated" | "deadline"> & {
  created: string;
  updated: string;
  deadline: string | null;
};

export function makeTodoJson({
  file,
  generateId,
}: MakeTodoJson): TodoRepository {
  async function read(): Promise<Todo[]> {
    const data = await file.read();
    const json = JSON.parse(data);

    if (!Array.isArray(json)) {
      throw new Error("Invalid JSON format");
    }

    return json.map((item: SerializedTodo) => ({
      ...item,
      deadline: item.deadline ? new Date(item.deadline) : null,
      created: new Date(item.created),
      updated: new Date(item.updated),
    }));
  }

  async function write(todos: Todo[]): Promise<void> {
    const serializedData = todos.map((item) => ({
      ...item,
      deadline: item.deadline ? item.deadline.toISOString() : null,
      created: item.created.toISOString(),
      updated: item.updated.toISOString(),
    }));
    const data = JSON.stringify(serializedData, null, 2);

    await file.write(data);
  }

  function findIndex(id: string, todos: Todo[]): number {
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new Error("Todo not found");
    }
    return index;
  }

  async function insert(data: Omit<Todo, "id">): Promise<Todo> {
    const todos = await read();
    const newTodo = {
      ...data,
      id: generateId(),
    };

    todos.push(newTodo);
    await write(todos);

    return newTodo;
  }

  async function update(
    id: string,
    data: Pick<Todo, "title" | "description" | "deadline">,
  ): Promise<Todo> {
    const todos = await read();
    const index = findIndex(id, todos);

    const todo = {
      ...todos[index],
      ...data,
      updated: new Date(),
    };

    todos[index] = todo;
    await write(todos);

    return todo;
  }

  async function remove(id: string): Promise<void> {
    const todos = await read();
    const index = findIndex(id, todos);

    todos.splice(index, 1);
    await write(todos);
  }

  async function find(id: string): Promise<Todo> {
    const todos = await read();
    const index = findIndex(id, todos);

    return todos[index] as Todo;
  }

  async function findAll(): Promise<Todo[]> {
    return await read();
  }

  async function toggle(id: string): Promise<Todo> {
    const todos = await read();
    const index = findIndex(id, todos);

    const todo = {
      ...todos[index],
      done: !todos[index].done,
      updated: new Date(),
    };

    todos[index] = todo;
    await write(todos);

    return todo;
  }

  return {
    insert,
    update,
    remove,
    find,
    findAll,
    toggle,
  };
}
