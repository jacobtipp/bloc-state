export abstract class BlocEvent<T = any> {
  private readonly _payload: T | undefined;

  constructor(payload?: T) {
    this._payload = payload;
  }

  static make<D, T extends InstanceType<typeof BlocEvent>>(
    this: new (payload?: D) => T,
    data?: D
  ): T {
    return new this(data);
  }

  get data() {
    return this._payload;
  }
}
