import { HydratedLocalStorage, HydratedStorage } from '../src/lib';

describe('HydratedLocalStorage', () => {
  const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
  const mockGetItem = jest.spyOn(Storage.prototype, 'getItem');
  const mockRemoveItem = jest.spyOn(Storage.prototype, 'removeItem');
  const mockClearItem = jest.spyOn(Storage.prototype, 'clear');

  mockClearItem.mockImplementation(jest.fn());
  mockSetItem.mockImplementation(jest.fn());
  mockGetItem.mockImplementation(jest.fn());
  mockRemoveItem.mockImplementation(jest.fn());

  const storage = new HydratedLocalStorage();
  HydratedStorage.storage = storage;

  afterEach(() => jest.resetAllMocks());

  it('should write values to localStorage', async () => {
    await storage.write('a', 0);

    expect(mockSetItem).toHaveBeenCalled();
  });

  it('should read values to localStorage', () => {
    storage.read('a');

    expect(mockGetItem).toHaveBeenCalled();
  });

  it('should handle error thrown from setItem', async () => {
    const setItemErrorMock = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Error was thrown');
      });

    try {
      await storage.write('a', 0);
    } catch (error: unknown) {
      if (error instanceof Error)
        expect(error.message).toBe('Error was thrown');
    }

    expect(setItemErrorMock).toHaveBeenCalled();
  });

  it('should handle deletion of rows', async () => {
    await storage.delete('a');
    expect(mockRemoveItem).toHaveBeenCalled();
  });

  it('should handle clearing storage', async () => {
    await storage.clear();
    expect(mockClearItem).toHaveBeenCalled();
  });

  it('should handle closing storage', async () => {
    await storage.close();

    const val = storage.read('a');
    expect(val).toBe(null);
    expect(mockGetItem).not.toHaveBeenCalled();
    await storage.write('test', 0);
    expect(mockSetItem).not.toHaveBeenCalled();
    await storage.delete('test');
    expect(mockRemoveItem).not.toHaveBeenCalled();
    await storage.clear();
    expect(mockClearItem).not.toHaveBeenCalled();
  });
});
