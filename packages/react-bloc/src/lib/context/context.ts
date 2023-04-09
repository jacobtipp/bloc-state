/**
 * `BaseContext` is a class that is used to implement a context map which stores related key-value pairs such as scopes and their associated containers.
 *
 * @template T The generic type parameter of the class indicating the type of the data stored in the map.
 */
export class BaseContext<T = unknown> {
  private context = new Map<string, T>();

  /**
   * Class constructor for the `BaseContext`. It binds all methods that need a `this` context so that they can be used with the instance of the current class.
   */
  constructor() {
    this.get = this.get.bind(this);
    this.has = this.has.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
  }

  /**
   * Checks if a given scope exists inside the context map.
   *
   * @param {string} scope A string representing the scope to check for existence.
   * @returns {boolean} Returns a boolean value indicating whether or not the given scope exists in the context map.
   */
  has(scope: string): boolean {
    return this.context.has(scope);
  }

  /**
   * Adds a given container to the context map under the provided scope.
   *
   * @param {string} scope A string representing the scope under which the container should be stored.
   * @param {T} container The container object that will be stored inside the context map.
   */
  add(scope: string, container: T) {
    this.context.set(scope, container);
  }

  /**
   * Returns the container associated with the given scope from the context map.
   *
   * @param {string} scope A string representing the scope for the container to be retrieved.
   * @returns {T | undefined} Returns the container associated with the given scope or undefined if no such container exists in the context map.
   */
  get(scope: string): T | undefined {
    return this.context.get(scope);
  }

  /**
   * Removes the container associated with the given scope from the context map.
   *
   * @param {string} scope A string representing the scope for the container to be removed.
   */
  remove(scope: string) {
    this.context.delete(scope);
  }

  /**
   * Clears all entries in the context map.
   */
  clear() {
    for (const [key, _container] of this.context.entries()) {
      this.context.delete(key);
    }
  }
}
