import { isValidDate } from "@utils/date.ts";
import { uuid } from "@utils/uuid.ts";

import { todoRepository } from "../data-access/index.ts";
import { todoFactory } from "../entity/index.ts";
import { makeCreateTodo } from "./createTodo.ts";
import { makeDeleteTodo } from "./deleteTodo.ts";
import { makeListTodos } from "./listTodos.ts";
import { makeToggleTodo } from "./toggleTodo.ts";
import { makeUpdateTodo } from "./updateTodo.ts";
import { SORTABLE_DIRECTIONS, SORTABLE_FIELDS } from "../entity/Todo.ts";

export const createTodo = makeCreateTodo({
  todoRepository: todoRepository,
  todoFactory: todoFactory,
  generateId: uuid,
});

export const deleteTodo = makeDeleteTodo({
  todoRepository: todoRepository,
});

export const listTodos = makeListTodos({
  todoRepository: todoRepository,
  sortableFields: SORTABLE_FIELDS,
  sortableDirections: SORTABLE_DIRECTIONS,
});

export const toggleTodo = makeToggleTodo({
  todoRepository: todoRepository,
});

export const updateTodo = makeUpdateTodo({
  todoRepository: todoRepository,
  isValidDate: isValidDate,
});
