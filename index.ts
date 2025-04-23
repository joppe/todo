import { todoJson } from "./src/todo/modules/todo/data-access/index.ts";

const result = await todoJson.insert({
  title: "test",
  description: "test",
  done: false,
  deadline: null,
});

console.log(result);
