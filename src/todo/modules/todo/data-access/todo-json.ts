import * as uuid from "jsr:@std/uuid";
import type { Todo } from "../entity/Todo.ts";

export type MakeTodoJson = {
  file: string;
};

export type SerializedTodo = Omit<Todo, "created" | "updated" | "deadline"> & {
  created: string;
  updated: string;
  deadline: string | null;
};

export type TodoJson = {
  insert: (data: Omit<Todo, "id" | "created" | "updated">) => Promise<Todo>;
  update: (data: Todo) => Promise<Todo>;
  remove: (id: string) => Promise<void>;
  find: (id: string) => Promise<Todo>;
};

export function makeTodoJson({ file }: MakeTodoJson): TodoJson {
  async function read(): Promise<Todo[]> {
    const data = await Deno.readFile(file);
    const decoded = new TextDecoder().decode(data);
    const json = JSON.parse(decoded);

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
    const json = JSON.stringify(serializedData, null, 2);
    const data = new TextEncoder().encode(json);

    await Deno.writeFile(file, data);
  }

  async function insert(
    data: Omit<Todo, "id" | "created" | "updated">,
  ): Promise<Todo> {
    const todos = await read();
    const newTodo = {
      ...data,
      id: uuid.v1.generate(),
      created: new Date(),
      updated: new Date(),
    };

    todos.push(newTodo);
    await write(todos);

    return newTodo;
  }

  async function update(data: Todo): Promise<Todo> {
    const todos = await read();
    const index = todos.findIndex((todo) => todo.id === data.id);

    if (index === -1) {
      throw new Error("Todo not found");
    }

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
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new Error("Todo not found");
    }

    todos.splice(index, 1);
    await write(todos);
  }

  async function find(id: string): Promise<Todo> {
    const todos = await read();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new Error("Todo not found");
    }

    return todos[index] as Todo;
  }

  return {
    insert,
    update,
    remove,
    find,
  };
}
