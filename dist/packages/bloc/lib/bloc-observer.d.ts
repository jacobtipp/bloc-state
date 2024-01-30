import { Bloc, BlocBase, Transition } from '.';
import { Change } from './';
/**
 * Defines methods to observe the state changes of a Bloc.
 */
export declare class BlocObserver {
    /**
     * Called when a new Bloc is created.
     * @param _bloc The newly created Bloc object.
     */
    onCreate(_bloc: BlocBase<any>, _initialState: any): void;
    /**
     * Called when an event is added to a Bloc.
     * @param _bloc The Bloc object that received the event.
     * @param _event The event that was added.
     */
    onEvent(_bloc: Bloc<any, any>, _event: any): void;
    /**
     * Called when a transition occurs in a Bloc.
     * @param _bloc The Bloc object where the transition occurred.
     * @param _transition The transition object that was made.
     */
    onTransition(_bloc: Bloc<any, any>, _transition: Transition<any, any>): void;
    /**
     * Called when an error occurs during the execution of a Bloc.
     * @param _bloc The Bloc object where the error occurred.
     * @param _error The error object that was thrown.
     */
    onError(_bloc: BlocBase<any>, _error: Error): void;
    /**
     * Called when a change occurs in the state of a Bloc.
     * @param _bloc The Bloc object whose state changed.
     * @param _change The change object that describes the state change.
     */
    onChange(_bloc: BlocBase<any>, _change: Change<any>): void;
    /**
     * Called when a Bloc object is closed and its state is cleared.
     * @param _bloc The Bloc object that was closed.
     */
    onClose(_bloc: BlocBase<any>): void;
}
