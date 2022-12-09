const path = require('path');

module.exports = {
    stories: [
        '../packages/*/src/**/*.stories.tsx',
        '../packages/*/src/**/*.stories.mdx'
        // '../stories/**/*.stories.@(js|jsx|ts|tsx)',
        // '../packages/*/src/**/*stories.mdx'
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

        config.module.rules.push({
            test: /\.scss$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 3,
                        sourceMap: true
                    }
                },
                { loader: 'resolve-url-loader' },
                {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: { outputStyle: 'compressed' },
                        sourceMap: true
                    }
                }
            ]
        });

        return config;
    }
};
