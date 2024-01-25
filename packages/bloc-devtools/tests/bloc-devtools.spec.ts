import { DevtoolsError, DevtoolsObserver } from '../src/lib/bloc-devtools';
import { BlocObserver, Cubit } from '@jacobtipp/bloc';

describe('blocDevtools ', () => {
  const tempConsoleError = console.error;
  console.error = () => undefined;

  afterAll(() => {
    console.error = tempConsoleError;
  });

  const instanceMock = {
    init: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
    unsubscribe: jest.fn(),
    send: jest.fn(),
  };

  window.__REDUX_DEVTOOLS_EXTENSION__ = {
    connect: jest.fn().mockImplementation(() => instanceMock),
  };

  class TestObserver extends DevtoolsObserver {}

  class CounterBloc extends Cubit<number> {
    increment = () => this.emit(this.state + 1);
  }

  it('should throw error if window.__Redux_Devtools_Extension__ does not exist', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ = undefined;

    expect(() => {
      new TestObserver();
    }).toThrowError(DevtoolsError);

    window.__REDUX_DEVTOOLS_EXTENSION__ = {
      connect: jest.fn().mockImplementation(() => instanceMock),
    };
  });

  it('should create Observer if window.__Redux_Devtools_Extension__ exists', () => {
    const observer = new TestObserver();
    expect(observer).toBeDefined();
    observer.onDestroy();
  });

  it('should create a subscription when a bloc is created', () => {
    const observer = new TestObserver();
    BlocObserver.observer = observer;

    const counterBloc = new CounterBloc(0);
    expect(window.__REDUX_DEVTOOLS_EXTENSION__.connect).toHaveBeenCalledTimes(
      1
    );
    counterBloc.increment();
    counterBloc.close();
    observer.onDestroy();

    expect(instanceMock.unsubscribe).toHaveBeenCalled();
    expect(instanceMock.subscribe).toHaveBeenCalled();
    expect(instanceMock.send).toHaveBeenCalled();
  });
});
