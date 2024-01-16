import { Bloc, Emitter } from '@jacobtipp/bloc';
import { restartable } from '@jacobtipp/bloc-concurrency';
import { TimerState, TimerStatus } from './timer.state';
import { TimerEvent } from './timer.event';
import {
  TimerStarted,
  TimerTicked,
  TimerPaused,
  TimerResumed,
  TimerReset,
} from './timer.event';
import { Ticker } from './ticker';
import { WithHydratedBloc } from '@jacobtipp/hydrated-bloc';

export class TimerBlocBase extends Bloc<TimerEvent, TimerState> {}

export class TimerBloc extends WithHydratedBloc(TimerBlocBase) {
  constructor(
    private readonly _id: number,
    private readonly _ticker: Ticker,
    _duration = 60
  ) {
    super(new TimerState(_duration));
    this.hydrate();

    this.on(TimerStarted, this._onStarted, restartable());
    this.on(TimerPaused, this._onPaused);
    this.on(TimerResumed, this._onResumed);
    this.on(TimerReset, this._onReset);
    this.on(TimerTicked, this._onTimerTicked);

    if (this.state.timerStatus === TimerStatus.InProgress) {
      this.add(new TimerStarted(this.state.data));
    }
  }

  override get id() {
    return this._id.toString();
  }

  protected override emit(newState: TimerState): void {
    super.emit(newState);
  }

  protected override onError(error: Error): void {
    console.error(error);
  }

  override fromJson(json: string): TimerState {
    const parsed = super.fromJson(json);
    return new TimerState(parsed.data).copyWith((state) => {
      state.timerStatus = parsed.timerStatus;
    });
  }

  private async _onStarted(event: TimerStarted, emit: Emitter<TimerState>) {
    if (
      this.state.timerStatus === TimerStatus.Paused ||
      this.state.timerStatus === TimerStatus.Initial
    )
      return;

    await emit.onEach(this._ticker.tick(event.duration), (duration) => {
      this.add(new TimerTicked(duration));
    });
  }

  private _onPaused(_event: TimerPaused, emit: Emitter<TimerState>) {
    emit(
      this.state.copyWith((state) => {
        state.timerStatus = TimerStatus.Paused;
      })
    );
    this.add(new TimerStarted(this.state.data));
  }

  private _onResumed(_event: TimerResumed, emit: Emitter<TimerState>) {
    emit(
      this.state.copyWith((state) => {
        state.timerStatus = TimerStatus.InProgress;
      })
    );
    this.add(new TimerStarted(this.state.data));
  }

  private _onReset(_event: TimerReset, emit: Emitter<TimerState>) {
    emit(
      this.state.copyWith((state) => {
        state.timerStatus = TimerStatus.Initial;
        state.data = 60;
      })
    );
    this.add(new TimerStarted(this.state.data));
  }

  private _onTimerTicked(event: TimerTicked, emit: Emitter<TimerState>) {
    if (event.duration > 0) {
      emit(
        this.state.copyWith((state) => {
          state.timerStatus = TimerStatus.InProgress;
          state.data = event.duration;
        })
      );
    } else {
      emit(
        this.state.copyWith((state) => {
          state.timerStatus = TimerStatus.Completed;
          state.data = event.duration;
        })
      );
    }
  }
}
