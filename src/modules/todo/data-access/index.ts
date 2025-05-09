import { uuid } from "@utils/uuid.ts";
import { makeFile } from "@gateways/file.ts";

import { makeJsonTodoRepository } from "./jsonTodoRepository.ts";

const repo = Deno.env.get("REPO_FILE");

if (!repo) {
  throw new Error("REPO_FILE environment variable is not set");
}

const file = await makeFile({
  file: repo,
  createFile: true,
});

export const todoRepository = makeJsonTodoRepository({
  file,
  generateId: uuid,
});
