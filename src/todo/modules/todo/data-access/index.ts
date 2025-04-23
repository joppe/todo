import * as path from "jsr:@std/path";
import { makeTodoJson } from "./todo-json.ts";

export const todoJson = makeTodoJson({
  file: path.join(
    String(import.meta.dirname),
    "../../../../../data",
    "todos.json",
  ),
});
