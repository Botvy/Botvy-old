module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: [
        './setupJest.js',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],
};
