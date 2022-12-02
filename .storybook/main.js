const path = require('path');

module.exports = {
    stories: [
        '../stories/**/*.stories.mdx',
        '../stories/**/*.stories.@(js|jsx|ts|tsx)',
        '../packages/react-json-editor/src/lib/stories/DefaultWidgets.stories.tsx'
        // '../stories/**/*.stories.@(js|jsx|ts|tsx)',
        // '../packages/*/src/**/*stories.mdx',
        // '../packages/*/src/*.stories.@(js|jsx|ts|tsx)'
    ],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-webpack5'
    },
    webpackFinal: async (config, { configType }) => {
        config.resolve.alias = config.resolve.alias || {};
        config.resolve.alias['@sagold/react-json-editor'] = path.resolve(
            __dirname,
            '..',
            'packages',
            'react-json-editor',
            'src'
        );
        config.resolve.alias['headless-json-editor'] = path.resolve(
            __dirname,
            '..',
            'packages',
            'headless-json-editor',
            'src'
        );
        config.resolve.alias['@sagold/rje-code-widgets'] = path.resolve(
            __dirname,
            '..',
            'packages',
            'headless-json-editor',
            'src'
        );
        return config;
    }
};
