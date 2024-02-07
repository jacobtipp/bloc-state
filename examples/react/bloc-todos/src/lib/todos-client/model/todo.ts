import { string, boolean, object, Output } from 'valibot';

export const TodoSchema = object({
  title: string(),
  description: string(),
  isCompleted: boolean(),
  id: string(),
});

export type Todo = Output<typeof TodoSchema>;
