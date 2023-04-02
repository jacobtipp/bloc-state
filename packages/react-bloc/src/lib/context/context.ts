export class BaseContext<T = unknown> {
  private context = new Map<string, T>();

  constructor() {
    this.get = this.get.bind(this);
    this.has = this.has.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
  }

  has(scope: string) {
    return this.context.has(scope);
  }

  add(scope: string, container: T) {
    this.context.set(scope, container);
  }

  get(scope: string) {
    return this.context.get(scope);
  }

  remove(scope: string) {
    this.context.delete(scope);
  }

  clear() {
    for (const [key, _container] of this.context.entries()) {
      this.context.delete(key);
    }
  }
}
