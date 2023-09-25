import { State } from '@jacobtipp/state';

export type User = {
  name: {
    first: string;
    last: string;
  };
  age: number;
};

export class UserState extends State<User> {
  constructor() {
    super({ name: { first: '', last: 'bloc-listener' }, age: 0 });
  }
}
