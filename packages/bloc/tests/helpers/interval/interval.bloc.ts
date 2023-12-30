import { Observable } from 'rxjs';
import { Bloc } from '../../../src';
import {
  IntervalEvent,
  IntervalForEachEvent,
  IntervalForEachEventWithoutOnError,
  IntervalOnEachEvent,
  IntervalOnEachEventWithoutOnError,
} from './interval.event';
import { IntervalState, NoOnErrorState } from './interval.state';

export class IntervalBloc extends Bloc<IntervalEvent, IntervalState> {
  constructor(stream$: Observable<number>) {
    super(new IntervalState(10));

    this.on(IntervalForEachEvent, async (_event, emit) => {
      await emit.forEach(
        stream$,
        (data) => this.state.ready(data),
        (error) => this.state.failed(error)
      );

      emit(this.state.loading()); // set loading to trigger completion
    });

    this.on(IntervalForEachEventWithoutOnError, async (_event, emit) => {
      try {
        await emit.forEach(stream$, (data) => this.state.ready(data));
      } catch (e) {
        emit(new NoOnErrorState(this.state.data));
      }
    });

    this.on(IntervalOnEachEvent, async (_event, emit) => {
      await emit.onEach(
        stream$,
        (data) => {
          emit(this.state.ready(data));
        },
        (error) => {
          emit(this.state.failed(error));
        }
      );
      emit(this.state.loading()); // set loading to trigger completion
    });

    this.on(IntervalOnEachEventWithoutOnError, async (_event, emit) => {
      try {
        await emit.onEach(stream$, (data) => {
          emit(this.state.ready(data));
        });
      } catch (e) {
        emit(new NoOnErrorState(this.state.data));
      }
    });
  }
}
