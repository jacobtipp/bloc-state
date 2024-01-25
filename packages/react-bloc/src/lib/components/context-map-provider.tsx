import { AbstractClassType, ClassType } from '@jacobtipp/bloc';
import {
  MutableRefObject,
  PropsWithChildren,
  createContext,
  createElement,
} from 'react';
import { isServer } from '../util';

export type AnyClassType = ClassType<any> | AbstractClassType<any>;

export type Closable = {
  close?: () => void;
  isClosed?: boolean;
} & InstanceType<AnyClassType>;

export type ProviderContext = {
  isHydrated: boolean;
  instance: MutableRefObject<Closable>;
};

export const clientContextMap: ProviderContextMap = new Map();

export type ProviderContextMap = Map<string, React.Context<ProviderContext>>;

export const contextMapContext = createContext<ProviderContextMap | undefined>(
  undefined
);

export const ContextMapProvider = ({ children }: PropsWithChildren) => {
  /* istanbul ignore next */
  return createElement(
    contextMapContext.Provider,
    {
      value: isServer ? new Map() : clientContextMap,
    },
    children
  );
};
