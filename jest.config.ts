import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'app/api/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 98,
      lines: 98,
      statements: 98
    }
  }, 
  setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;
