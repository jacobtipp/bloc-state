import { HomeBloc } from './home.cubit';

describe('HomeBloc', () => {
  let instance: HomeBloc;

  beforeEach(() => {
    instance = new HomeBloc();
  });

  afterEach(() => {
    instance.close();
  });

  it('should be an instanceof HomeBloc', () => {
    expect(instance instanceof HomeBloc).toBeTruthy();
    expect(instance.state).toStrictEqual({ currentId: 9001 });
  });

  describe('incrementId', () => {
    it('should increment the id', () => {
      expect(instance.state).toStrictEqual({ currentId: 9001 });
      instance.incrementId();
      expect(instance.state).toStrictEqual({
        previousId: 9001,
        currentId: 9002,
      });
    });
  });
});
