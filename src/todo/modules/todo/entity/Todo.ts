export type Todo = {
  id: string;
  title: string;
  description: string;
  done: boolean;
  deadline: Date | null;
  created: Date;
  updated: Date;
};
