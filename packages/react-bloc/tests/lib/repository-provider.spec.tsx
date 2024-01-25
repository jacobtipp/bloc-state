import { render, waitFor } from '@testing-library/react';
import { ArticleFeature } from './article';
import { StrictMode } from 'react';

describe('RepositoryProvider', () => {
  const consoleError = console.error;
  const consoleWarn = console.warn;
  const mockWarn = jest.fn();

  beforeAll(() => {
    console.error = () => {
      return;
    };

    console.warn = mockWarn;
  });

  afterAll(() => {
    console.error = consoleError;
    console.warn = consoleWarn;
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

    await waitFor(() => expect(mockWarn).toHaveBeenCalled(), {
      timeout: 6000,
    });
  }, 10000);
});
