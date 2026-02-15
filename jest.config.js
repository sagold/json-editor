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
        '^@sagold/react-json-editor$': path.resolve('./packages/react-json-editor/src/index.ts'),
        '^@sagold/rje-mantine-widgets$': path.resolve('./packages/rje-mantine-widgets/src/index.ts'),
        '^@sagold/rje-code-widgets$': path.resolve('./packages/rje-code-widgets/src/index.ts'),
        'headless-json-editor': path.resolve('./packages/headless-json-editor/src/index.ts')
    },
    setupFilesAfterEnv: ['./jest.setup.ts']
};
