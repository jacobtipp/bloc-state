import { Context } from 'react';
import { BaseContext } from './context';

export type ContextContainer = {
  context: Context<any>;
  count: number;
};

export class BlocContext extends BaseContext<ContextContainer> {
  override add(
    scope: string,
    container: { context: Context<any>; count: number }
  ): void {
    ++container.count;
    super.add(scope, container);
  }

  override remove(scope: string): void {
    const providerContext = this.get(scope);

    if (!providerContext) return;

    if (--providerContext.count < 1) {
      super.remove(scope);
    }
  }
}
export const globalContext = new BlocContext();
