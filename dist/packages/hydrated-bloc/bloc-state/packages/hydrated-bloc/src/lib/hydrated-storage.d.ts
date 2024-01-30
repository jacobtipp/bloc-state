export declare abstract class Storage {
    abstract read(key: string): any;
    abstract write(key: string, value: any): Promise<void>;
    abstract delete(key: string): Promise<void>;
    abstract clear(): Promise<void>;
    abstract close(): Promise<void>;
}
export declare abstract class HydratedStorage {
    private static _storage;
    static get storage(): Storage;
    static set storage(storage: Storage);
}
export declare class StorageNotFound extends Error {
    constructor(message: string);
}
