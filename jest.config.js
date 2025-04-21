const path = require('path');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            // required due to custom location of tsconfig.json configuration file
            // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
            { tsconfig: './tsconfig.spec.json' }
        ]
    },
    modulePathIgnorePatterns: ['dist'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'html'],
    moduleNameMapper: {
        'headless-json-editor': path.resolve('./packages/headless-json-editor/src/index.ts')
    },
    setupFilesAfterEnv: ['./jest.setup.ts']
};
