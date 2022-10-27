import { BlocEvent } from "../../../lib/event";

export abstract class CounterEvent extends BlocEvent {}
export class CounterIncrementEvent extends CounterEvent {}
export class CounterDecrementEvent extends CounterEvent {}
export class CounterNoEmitDataEvent extends CounterEvent {}
