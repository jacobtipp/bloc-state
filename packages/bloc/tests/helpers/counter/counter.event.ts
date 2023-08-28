export abstract class CounterEvent {}
export class CounterIncrementEvent extends CounterEvent {}
export class CounterDecrementEvent extends CounterEvent {}
export class CounterNoEmitDataEvent extends CounterEvent {}
export class CounterNoRegistrationEvent extends CounterEvent {}
