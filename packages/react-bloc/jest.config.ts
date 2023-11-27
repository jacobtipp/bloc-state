/* eslint-disable */
export default {
  displayName: 'react-bloc',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
    '^.+\\.[tj]s?$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: ['src/lib/**/*.{js,ts,tsx,jsx}'],
  coverageReporters: ['clover', 'json', 'lcov', 'text'],
  coverageDirectory: '../../coverage/packages/react-bloc',
};
