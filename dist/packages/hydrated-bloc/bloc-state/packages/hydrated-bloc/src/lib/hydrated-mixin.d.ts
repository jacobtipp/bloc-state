export interface HydratedMixin<State> {
    id: string;
    storagePrefix: string;
    storageToken: string;
    clear(): Promise<void>;
    fromJson(json: string): State;
    toJson(state: State): string;
    hydrate(): void;
}
