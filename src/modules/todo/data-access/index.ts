import { uuid } from "@utils/uuid.ts";
import { makeFile } from "@gateways/file.ts";

import { makeTodoJson } from "./todoJson.ts";

const file = await makeFile({
  file: "/home/joppe/todo/todos.json",
  createFile: true,
});

export const todoRepository = makeTodoJson({
  file,
  generateId: uuid,
});
