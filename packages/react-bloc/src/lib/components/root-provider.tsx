import { AbstractClassType, ClassType } from '@jacobtipp/bloc';
import { PropsWithChildren, createContext, createElement } from 'react';
import { isServer } from '../util';

export type AnyClassType = ClassType<any> | AbstractClassType<any>;

export type ProviderContext = {
  instance: any;
};

export const clientContextMap: ProviderContextMap = new Map();

export type ProviderContextMap = Map<string, React.Context<ProviderContext>>;

export const contextMapContext = createContext<ProviderContextMap | undefined>(
  undefined
);

export const RootProvider = ({ children }: PropsWithChildren) => {
  /* istanbul ignore next */
  return createElement(
    contextMapContext.Provider,
    {
      value: isServer ? new Map() : clientContextMap,
    },
    children
  );
};
