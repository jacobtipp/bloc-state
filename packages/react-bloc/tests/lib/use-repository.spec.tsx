import { render } from '@testing-library/react';
import { ArticleRepository } from './article';
import { useRepository } from '../../src/lib';

const ArticleComponent = () => {
  const repo = useRepository(ArticleRepository);
  return <div>{repo.getArticle.name}</div>;
};

describe('useBloc', () => {
  it('should throw an error if a bloc is not wrapped in a Provider', () => {
    expect(() => render(<ArticleComponent />)).toThrow();
  });
});
