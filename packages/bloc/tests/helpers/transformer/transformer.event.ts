import { BlocEvent } from '../../../src';

export abstract class EventTransformerEvent extends BlocEvent {}

export class EventTransformerRestartableEvent extends EventTransformerEvent {
  constructor(public num = 1) {
    super();
  }
}
