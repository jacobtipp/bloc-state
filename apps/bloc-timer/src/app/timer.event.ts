export abstract class TimerEvent {
  protected _!: void;
}

export class TimerStarted extends TimerEvent {
  constructor(public duration: number) {
    super();
  }
}

export class TimerTicked extends TimerEvent {
  constructor(public duration: number) {
    super();
  }
}

export class TimerPaused extends TimerEvent {}

export class TimerResumed extends TimerEvent {}

export class TimerReset extends TimerEvent {}
