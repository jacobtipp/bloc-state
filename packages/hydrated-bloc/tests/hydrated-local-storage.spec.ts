import { HydratedLocalStorage, HydratedStorage } from '../src/lib';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as unknown as Storage;

describe('HydratedLocalStorage', () => {
  const storage = new HydratedLocalStorage();
  HydratedStorage.storage = storage;

  afterEach(() => jest.resetAllMocks());

  it('should write values to localStorage', async () => {
    await storage.write('a', 0);

    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should read values to localStorage', () => {
    storage.read('a');

    expect(localStorageMock.getItem).toHaveBeenCalled();
  });

  it('should handle error thrown from setItem', async () => {
    jest.spyOn(localStorageMock, 'setItem').mockImplementation(() => {
      throw new Error('Error was thrown');
    });

    try {
      await storage.write('a', 0);
    } catch (error: unknown) {
      if (error instanceof Error)
        expect(error.message).toBe('Error was thrown');
    }

    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should handle deletion of rows', async () => {
    await storage.delete('a');
    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });

  it('should handle clearing storage', async () => {
    await storage.clear();
    expect(localStorageMock.clear).toHaveBeenCalled();
  });

  it('should handle closing storage', async () => {
    await storage.close();

    const val = storage.read('a');
    expect(val).toBe(null);
    expect(localStorageMock.getItem).not.toHaveBeenCalled();
    await storage.write('test', 0);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    await storage.delete('test');
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    await storage.clear();
    expect(localStorageMock.clear).not.toHaveBeenCalled();
  });
});
