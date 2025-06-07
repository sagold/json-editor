const { getJestConfig } = require('@storybook/test-runner');

// The default Jest configuration comes from @storybook/test-runner
const testRunnerConfig = getJestConfig();

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
    ...testRunnerConfig,
    /** Add your own overrides below, and make sure
     *  to merge testRunnerConfig properties with your own
     * @see https://jestjs.io/docs/configuration
     */
    testTimeout: 20_000, // 20 seconds per story
    testPathIgnorePatterns: ['packages/rje-code-widgets']
};
