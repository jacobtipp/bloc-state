import { State } from '@jacobtipp/state';
import { TodosOverviewViewModel } from '../model';

export class TodosOverviewState extends State<TodosOverviewViewModel> {
  constructor() {
    super({
      todos: [],
      filter: 'all',
    });
  }
}
