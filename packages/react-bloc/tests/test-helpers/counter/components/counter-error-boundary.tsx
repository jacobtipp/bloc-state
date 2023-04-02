import { FallbackProps } from 'react-error-boundary';
import { BlocRenderError } from '../../../../src';

export const CounterErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  const count = error instanceof BlocRenderError ? (error.state as number) : 10;

  return (
    <div role="alert">
      <pre data-testid="test-count">{count}</pre>
      <button data-testid="test-count-button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
};
