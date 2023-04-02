import { CreatorKey } from './types';

export const extractKey = (key: CreatorKey<unknown>) =>
  typeof key === 'string' ? `${key}` : `${key.name}`;
