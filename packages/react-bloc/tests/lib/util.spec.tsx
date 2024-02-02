import { isClient } from '../../src';

describe('isClient', () => {
  it('it should check if the environment is in a browser environment', () => {
    expect(isClient()).toBe(true);
  });
});
