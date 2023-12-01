/* eslint-disable */
export default {
  displayName: 'bloc-query',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s?$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ['src/lib/**/*.{js,ts,tsx,jsx}'],
  coverageReporters: ['clover', 'json', 'lcov', 'text'],
  coverageDirectory: '../../coverage/packages/bloc-query',
};
