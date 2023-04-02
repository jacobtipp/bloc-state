import React, {
  Context,
  createContext,
  Fragment,
  useEffect,
  useState,
} from 'react';
import { globalContext } from '../../context/bloc-context';
import { Creator } from '../../types';
import { extractKey } from '../../util';

export type Disposable<T> = (value: T) => void;

export type ProviderProps<T> = {
  creator: Creator<T>;
  deps?: React.DependencyList;
};

export type ProviderState = {
  context: Context<any>;
  value: any;
  name: string;
  dispose?: Disposable<any>;
};

function getStateFromProps<T>(
  { creator }: ProviderProps<T>,
  dispose?: Disposable<T>
): ProviderState {
  const name = extractKey(creator.key);
  const value = creator.create();
  const container = globalContext.get(name) ?? {
    creator: creator.dispose ? creator : { ...creator, dispose },
    context: createContext(value),
    count: 0,
  };

  container.context.displayName = name;
  globalContext.add(name, container);

  return {
    context: container.context,
    name,
    value,
    dispose: creator.dispose ?? dispose,
  };
}

export function createProvider<T>(dispose?: Disposable<T>) {
  return function (props: React.PropsWithChildren<ProviderProps<T>>) {
    const [state, setState] = useState<ProviderState | null>(null);

    useEffect(() => {
      const stateFromProps = getStateFromProps(props, dispose);

      setState(stateFromProps);

      return () => {
        globalContext.remove(stateFromProps.name);
        if (stateFromProps.dispose) {
          stateFromProps.dispose(stateFromProps.value);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, props.deps ?? []);

    if (state) {
      return (
        <state.context.Provider value={state.value}>
          {props.children}
        </state.context.Provider>
      );
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <Fragment></Fragment>;
  };
}
