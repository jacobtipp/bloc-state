import { Context } from 'react';
import { BaseContext } from './base-context';
/**
 * `ContextContainer` is an interface defining the shape of a container object that holds a context instance and a count that tracks how many references to the context exists.
 */
export type ContextContainer<Value = unknown> = {
  context: Context<Value>;
  count: number;
};

/**
 * `BlocContext` is a class that extends the `BaseContext` class. It defines methods to add and remove containers containing contexts with additional tracking functionality.
 */
export class ProviderContext<T = unknown> extends BaseContext<
  ContextContainer<T>
> {
  /**
   * Adds a given container to the context map under the provided scope. This method increments the count of the container by one.
   *
   * @override
   * @param {string} scope A string representing the scope under which the container should be stored.
   * @param {{context: Context<any>,count: number}} container The container object that will be stored inside the context map.
   */
  override add(scope: string, container: ContextContainer<T>): void {
    ++container.count;
    super.add(scope, container);
  }

  /**
   * Removes the container associated with the given scope from the context map. This method decrements the count of the container by one and removes it if the count is less than one.
   *
   * @override
   * @param {string} scope A string representing the scope for the container to be removed.
   */
  override remove(scope: string): void {
    const providerContext = this.get(scope);

    if (!providerContext) return;

    if (--providerContext.count < 1) {
      super.remove(scope);
    }
  }
}

const globalContextSingleton = new ProviderContext();

/**
 * A global instance of the `BlocContext` class created when this module is imported.
 */
export const getProviderContext = <T>() => {
  return globalContextSingleton as ProviderContext<T>;
};
