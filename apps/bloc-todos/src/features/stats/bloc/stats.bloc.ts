import { Bloc, Emitter } from '@jacobtipp/bloc';
import { StatsEvent, StatsSubscriptionRequested } from './stats.event';
import { StatsState } from './stats.state';
import { TodosRepository } from '../../../packages/todos-repository/todos-repository';

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

    await emit.onEach(this.todosRepository.getTodos(), (query) => {
      if (query.isFetching) {
        emit(this.state.loading());
      }

      if (query.isReady) {
        emit(
          this.state.ready({
            completedTodos: query.data.filter((todo) => todo.isCompleted)
              .length,
            activeTodos: query.data.filter((todo) => !todo.isCompleted).length,
          })
        );
      }
    });
  }
}
