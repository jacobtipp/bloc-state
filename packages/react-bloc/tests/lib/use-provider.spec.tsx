import { render } from '@testing-library/react';
import { ArticleClient } from './article';
import {
  RootProvider,
  Provider,
  clientContextMap,
  useProvider,
} from '../../src/lib';

type ErrorType = 'no-context-map-provider' | 'no-context';

const ArticleComponentTest = ({ type }: { type: ErrorType }) => {
  if (type === 'no-context-map-provider') {
    const ArticleComponent = () => {
      const repo = useProvider(ArticleClient);
      return <div>{repo.getArticle.name}</div>;
    };
    return <ArticleComponent />;
  } else {
    const ArticleComponent = () => {
      clientContextMap.clear();
      const repo = useProvider(ArticleClient);
      return <div>{repo.getArticle.name}</div>;
    };

    return (
      <RootProvider>
        <Provider classDef={ArticleClient} create={() => new ArticleClient()}>
          <ArticleComponent />
        </Provider>
      </RootProvider>
    );
  }
};

describe('useProvider', () => {
  const consoleError = console.error;
  beforeAll(() => {
    console.error = () => {
      return;
    };
  });

  afterAll(() => {
    console.error = consoleError;
  });

  it('should throw an error if a Repository is not wrapped in a Provider', () => {
    expect(() =>
      render(<ArticleComponentTest type="no-context-map-provider" />)
    ).toThrow();
  });

  it('should throw an error if a Repository is not wrapped in a Provider', () => {
    expect(() =>
      render(<ArticleComponentTest type="no-context" />)
    ).toThrowErrorMatchingInlineSnapshot(
      '"ArticleClient does not exist in the context map."'
    );
  });
});
