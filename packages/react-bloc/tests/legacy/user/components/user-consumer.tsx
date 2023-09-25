import { FallbackProps } from 'react-error-boundary';

import { UserSuspenseEvent } from '../user-event';
import {
  useUserFirstName,
  useUserLastName,
  useUserLastNameListener,
} from '../user.hooks';
import { useBlocInstance } from '../../../../src';
import { UserBloc } from '../user-bloc';

export const UserBlocValueConsumer = () => {
  const first = useUserFirstName();

  return <p data-testid="test-first-name">{first}</p>;
};

export const UserBlocSelectorConsumer = () => {
  const { add } = useBlocInstance(UserBloc);
  const last = useUserLastName();

  return (
    <>
      <p data-testid="test-last-name">{last}</p>;
      <p
        data-testid="test-suspense-trigger"
        onClick={() => add(new UserSuspenseEvent())}
      >
        click
      </p>
    </>
  );
};

export const UserBlocListenerConsumer = () => {
  const last = useUserLastNameListener();
  return <p data-testid="test-last-name">{last}</p>;
};

export const UserBlocErrorConsumer = () => {
  const last = useUserLastName();
  return <p data-testid="test-last-name">{last}</p>;
};

export const UserBlocSuspenseConsumer = () => {
  const last = useUserLastName();
  return <p data-testid="test-last-name">{last}</p>;
};

export const UserBlocSuspenseFallback = () => {
  return <div data-testid="test-bloc-suspense">loading</div>;
};

export const UserBlocErrorFallback = ({
  resetErrorBoundary,
}: FallbackProps) => (
  <div role="alert">
    <pre data-testid="test-bloc-error">error-triggered</pre>
    <button data-testid="test-reset-button" onClick={resetErrorBoundary}>
      Try again
    </button>
  </div>
);
