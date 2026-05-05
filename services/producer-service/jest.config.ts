import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },
};

export default config;