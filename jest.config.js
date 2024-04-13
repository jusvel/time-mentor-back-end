module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverage: true,
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
