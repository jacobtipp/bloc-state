import { Bloc } from '@jacobtipp/bloc';
import { concatMap, delay as eventDelay } from 'rxjs';
import {
  UserAgeChangedEvent,
  UserErrorEvent,
  UserEvent,
  UserLastNameAsyncChangedEvent,
  UserLastNameChangedEvent,
  UserNameChangedEvent,
  UserSuspenseEvent,
} from './user-event';
import { UserState } from './user-state';
import delay from '../../test-helpers/delay';

export class UserBloc extends Bloc<UserEvent, UserState> {
  constructor() {
    super(new UserState());

    this.on(UserLastNameChangedEvent, async (_event, emit) => {
      await delay(3000);
      emit(
        this.state.ready((user) => {
          user.name.last = 'parker';
        })
      );
    });

    this.on(UserAgeChangedEvent, (_event, emit) => {
      emit(
        this.state.ready((user) => {
          user.age = this.state.data.age + 1;
        })
      );
    });

    this.on(UserLastNameAsyncChangedEvent, async (event, emit) => {
      emit(this.state.loading());
      await delay(1000);
      emit(
        this.state.ready((user) => {
          user.name.last = event.userName;
        })
      );
    });

    this.on(UserNameChangedEvent, (event, emit) => {
      emit(
        this.state.ready((user) => {
          user.name = event.userName;
        })
      );
    });

    this.on(
      UserErrorEvent,
      (_event, emit) => {
        emit(
          this.state.ready((user) => {
            user.name.last = 'bloc-error';
          })
        );
        // delay 1 second before processing event
      },
      (event, mapper) => event.pipe(eventDelay(1000), concatMap(mapper))
    );

    this.on(UserSuspenseEvent, (_event, emit) => {
      emit(this.state.loading());
    });
  }
}
