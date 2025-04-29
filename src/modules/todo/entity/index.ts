import { isValidDate } from "@utils/date.ts";

import { makeTodoFactory } from "./todoFactory.ts";

export const todoFactory = makeTodoFactory({
  isValidDate: isValidDate,
});
