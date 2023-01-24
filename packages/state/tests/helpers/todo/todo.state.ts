import { State } from '../../../src/lib/state';

export type Todo = {
  id: number;
  title: string;
};

export class TodoState extends State<Todo> {}
