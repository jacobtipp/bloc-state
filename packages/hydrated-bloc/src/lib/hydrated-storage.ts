export abstract class Storage {
  abstract read(key: string): any;
  abstract write(key: string, value: any): Promise<void>;
  abstract delete(key: string): Promise<void>;
  abstract clear(): Promise<void>;
  abstract close(): Promise<void>;
}

const isServer = typeof window === 'undefined';

export abstract class HydratedStorage {
  private static _storage: Storage | null = null;

  static get storage() {
    if (HydratedStorage._storage === null)
      throw new StorageNotFound('Storage not found!');
    return HydratedStorage._storage;
  }

  static set storage(storage: Storage) {
    /* istanbul ignore next */
    if (isServer) return;
    HydratedStorage._storage = storage;
  }
}

export class StorageNotFound extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, StorageNotFound.prototype);
  }
}
