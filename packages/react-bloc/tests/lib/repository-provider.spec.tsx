import { render } from '@testing-library/react';
import { ArticleFeature } from './article';
import { StrictMode } from 'react';

describe('RepositoryProvider', () => {
  const consoleError = console.error;

  beforeAll(() => {
    console.error = () => {
      return;
    };
  });

  afterAll(() => {
    console.error = consoleError;
    jest.clearAllMocks();
  });

  it('should provide a repository instance', async () => {
    const { findByTestId } = render(
      <StrictMode>
        <ArticleFeature />
      </StrictMode>
    );
    const id = (await findByTestId('article-id')).textContent;
    const body = (await findByTestId('article-body')).textContent;
    expect(id).toBe('1');
    expect(body).toBe('new article');
  }, 10000);
});
