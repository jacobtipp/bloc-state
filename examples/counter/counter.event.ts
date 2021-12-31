import { BlocEvent } from "../../lib/event";
export abstract class CounterEvent extends BlocEvent {}
export class IncrementCounterEvent extends CounterEvent {}
export class DecrementCounterEvent extends CounterEvent {}
