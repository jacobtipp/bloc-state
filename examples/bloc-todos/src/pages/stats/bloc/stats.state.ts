import { State } from '@jacobtipp/state';
import { StatsViewModel } from '../model/stats';

export class StatsState extends State<StatsViewModel> {
  constructor() {
    super({
      activeTodos: 0,
      completedTodos: 0,
    });
  }
}
