import { merge, Observable, Subscription } from "rxjs";
import { BlocBase } from "./base";
import { BlocState } from "./state";
import { BlocStateType } from "./types";

export interface BlocListenerContructor {
  new ();
}

export abstract class BlocListener<T extends BlocBase<any>> {
  private blocListenerStreamSubscription: Subscription = Subscription.EMPTY;
  private state$: Observable<BlocStateType<T>>;
  private active = false;

  constructor(...blocs: T[]) {
    this.state$ = merge.apply(
      this,
      blocs.map((bloc) => bloc.state$)
    );
  }

  protected build() {
    if (!this.active) {
      this.blocListenerStreamSubscription = this.state$.subscribe({
        next: (state) => this.listen(state),
      });
      this.active = true;
    }
  }

  protected listen(state: BlocStateType<T>) {}

  close() {
    this.blocListenerStreamSubscription.unsubscribe();
  }
}
