import { render } from '@testing-library/react';
import { ArticleRepository } from './article';
import { useRepository } from '../../src/lib';

const ArticleComponent = () => {
  const repo = useRepository(ArticleRepository);
  return <div>{repo.getArticle.name}</div>;
};

describe('useRepository', () => {
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
    expect(() => render(<ArticleComponent />)).toThrow();
  });
});
