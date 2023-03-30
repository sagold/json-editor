const path = require('path');
module.exports = {
    babel: (config) => {
        return { ...config, rootMode: 'upward' };
    },
    stories: [
        '../packages/docs/src/Introduction.stories.mdx',
        '../packages/*/src/**/*.stories.tsx',
        '../packages/*/src/**/*.mdx'
    ],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: {
        name: '@storybook/react-webpack5',
        options: {}
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
        config.resolve.alias['@sagold/rje-widgets'] = path.resolve(__dirname, '..', 'packages', 'rje-widgets', 'src');
        config.resolve.alias['@sagold/rje-code-widgets'] = path.resolve(
            __dirname,
            '..',
            'packages',
            'rje-code-widgets',
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
                {
                    loader: 'resolve-url-loader'
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            outputStyle: 'compressed'
                        },
                        sourceMap: true
                    }
                }
            ]
        });
        return config;
    },
    docs: {
        autodocs: true
    }
};
