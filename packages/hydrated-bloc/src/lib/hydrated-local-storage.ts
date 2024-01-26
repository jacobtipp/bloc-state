import { Storage } from '.';

export class HydratedLocalStorage extends Storage {
  private _closed = false;

  override read(key: string) {
    if (this._closed) return null;
    return localStorage.getItem(key) ?? null;
  }

  override write(key: string, value: any): Promise<void> {
    if (this._closed) return Promise.resolve();
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, value);
        resolve();
      } catch (error: any) {
        if (error instanceof Error) reject(error);
      }
    });
  }

  override delete(key: string): Promise<void> {
    if (this._closed) return Promise.resolve();
    return new Promise((resolve) => {
      localStorage.removeItem(key);
      resolve();
    });
  }
  override clear(): Promise<void> {
    if (this._closed) return Promise.resolve();
    return new Promise((resolve) => {
      localStorage.clear();
      resolve();
    });
  }

  override async close(): Promise<void> {
    this._closed = true;
  }
}
