import { Storage } from '.';
export declare class HydratedLocalStorage extends Storage {
    private _closed;
    read(key: string): string | null;
    write(key: string, value: any): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    close(): Promise<void>;
}
