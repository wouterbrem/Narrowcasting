/**
 * Jest Configuration
 * For more information: https://jestjs.io/docs/configuration
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage directory
  coverageDirectory: 'coverage',

  // Collect coverage from these files
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/__tests__/**',
    '!server/index.js', // Exclude main entry point (integration test)
    '!**/node_modules/**'
  ],

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Setup files
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Coverage thresholds (optional - enforce minimum coverage)
  coverageThresholds: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/client/',
    '/dist/',
    '/build/'
  ],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset mocks between tests
  resetMocks: true
};
