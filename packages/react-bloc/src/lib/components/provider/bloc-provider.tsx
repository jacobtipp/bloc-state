import { BlocBase } from '@jacobtipp/bloc';
import React, { PropsWithChildren, useMemo } from 'react';
import { MultiCreator } from '../../types';
import { createProvider } from './provider';

export type MultiBlocProvider = {
  blocs: MultiCreator<BlocBase<any>>;
  deps?: React.DependencyList;
};

const Provider = createProvider<BlocBase<any>>((bloc) => bloc.close());
export const BlocProvider = (props: PropsWithChildren<MultiBlocProvider>) => {
  const components = useMemo(() => {
    return props.blocs.map((creator) => {
      return ({ children }: PropsWithChildren) => (
        <Provider creator={creator} deps={props.deps}>
          {children}
        </Provider>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, props.deps);

  // https://javascript.plainenglish.io/how-to-combine-context-providers-for-cleaner-react-code-9ed24f20225e
  const Providers = useMemo(() => {
    return components.reduce(
      (Acc, Current) => {
        return ({ children }) => {
          return (
            <Acc>
              <Current>{children}</Current>
            </Acc>
          );
        };
      },
      // eslint-disable-next-line react/jsx-no-useless-fragment
      ({ children }) => <>{children}</>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components]);

  return <Providers>{props.children}</Providers>;
};
