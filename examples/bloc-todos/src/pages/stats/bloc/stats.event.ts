import { BlocEvent } from '@jacobtipp/bloc';

export abstract class StatsEvent extends BlocEvent {}

export class StatsSubscriptionRequested extends StatsEvent {}
