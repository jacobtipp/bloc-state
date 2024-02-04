import { Bloc, Emitter } from '@jacobtipp/bloc';
import { StatsEvent, StatsSubscriptionRequested } from './stats.event';
import { StatsState } from './stats.state';
import { TodosRepository } from '@/lib/todos-repository/todos-repository';

export class StatsBloc extends Bloc<StatsEvent, StatsState> {
  constructor(private todosRepository: TodosRepository) {
    super(new StatsState());

    this.on(StatsSubscriptionRequested, this.onSubscriptionRequested);
  }

  async onSubscriptionRequested(
    _event: StatsSubscriptionRequested,
    emit: Emitter<StatsState>
  ) {
    emit(this.state.loading());

    await emit.forEach(this.todosRepository.getTodos(), (todos) => {
      return this.state.ready({
        completedTodos: todos.filter((todo) => todo.isCompleted).length,
        activeTodos: todos.filter((todo) => !todo.isCompleted).length,
      });
    });
  }
}
