import { render } from '@testing-library/react';
import { ArticleFeature } from './article';

describe('RepositoryProvider', () => {
  it('should provide a repository instance', async () => {
    const { findByTestId } = render(<ArticleFeature />);
    const id = (await findByTestId('article-id')).textContent;
    const body = (await findByTestId('article-body')).textContent;
    expect(id).toBe('1');
    expect(body).toBe('new article');
  });
});
