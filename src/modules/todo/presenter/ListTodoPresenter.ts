import { Todo } from "../entity/Todo.ts";

export type ListTodoPresenter = (todos: Todo[], fields?: string[]) => string;
