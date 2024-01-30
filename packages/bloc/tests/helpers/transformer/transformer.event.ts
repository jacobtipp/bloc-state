export abstract class EventTransformerEvent {}

export class EventTransformerRestartableEvent extends EventTransformerEvent {
  constructor(public num = 1) {
    super();
  }
}

export class SecondEventTransformerRestartableEvent extends EventTransformerEvent {
  constructor(public num = 1) {
    super();
  }
}
