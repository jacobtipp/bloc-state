import { nanoid } from 'nanoid';

export class Todo {
  constructor(
    public title: string,
    public description: string,
    public isCompleted = false,
    public id = nanoid()
  ) {}
}
