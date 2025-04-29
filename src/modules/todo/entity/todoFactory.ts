import { Todo } from "./Todo.ts";

export type MakeTodoFactoryProps = {
  isValidDate: (date: Date) => boolean;
};

export function makeTodoFactory({ isValidDate }: MakeTodoFactoryProps) {
  return function todoFactory({
    id,
    title,
    description,
    done,
    deadline,
    created,
    updated,
  }: Todo): Todo {
    if (!isValidDate(created)) {
      throw new Error("Invalid created date");
    }

    if (!isValidDate(updated)) {
      throw new Error("Invalid updated date");
    }

    if (deadline !== null && !isValidDate(deadline)) {
      throw new Error("Invalid deadline date");
    }

    return {
      id,
      title,
      description,
      done,
      deadline,
      created,
      updated,
    };
  };
}
