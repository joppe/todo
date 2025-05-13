import { faker } from "@faker-js/faker";

import { Todo } from "../entity/Todo.ts";

export function fakeTodo(overrides: Partial<Todo> = {}): Todo {
  const created = faker.date.future({ years: 2 });
  const updated = faker.date.future({
    years: 1,
    refDate: created.toISOString(),
  });
  const todo: Todo = {
    id: fakeId(),
    title: faker.word.words({ count: { min: 1, max: 4 } }),
    description: faker.word.words({ count: { min: 5, max: 12 } }),
    done: Math.random() > 0.8 ? true : false,
    deadline: null,
    created,
    updated,
  };

  return {
    ...todo,
    ...overrides,
  };
}

export function fakeTodos(number?: number): Todo[] {
  const length = number ?? faker.number.int({ min: 3, max: 10 });

  return Array.from({ length }).map(() => fakeTodo());
}

export function fakeId(): string {
  return faker.string.uuid();
}
