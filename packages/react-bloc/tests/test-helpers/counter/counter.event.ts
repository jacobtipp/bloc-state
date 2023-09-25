import { BlocEvent } from '@jacobtipp/bloc';

export abstract class CounterEvent extends BlocEvent {}
export class IncrementCounterEvent extends CounterEvent {}
export class DecrementCounterEvent extends CounterEvent {}
