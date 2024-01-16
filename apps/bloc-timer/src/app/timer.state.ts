import { State } from '@jacobtipp/state';

export enum TimerStatus {
  Initial,
  Paused,
  Resumed,
  InProgress,
  Completed,
}
export class TimerState extends State<number> {
  public timerStatus = TimerStatus.Initial;
}
