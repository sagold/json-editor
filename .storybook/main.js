import { dirname, join } from 'path';
const path = require('path');
module.exports = {
    babel: (config) => {
        return {
            ...config,
            rootMode: 'upward'
        };
    },
    stories: [
        '../packages/docs/src/Introduction.stories.mdx',
        '../packages/*/src/**/*.stories.tsx',
        '../packages/*/src/**/*.mdx'
    ],
    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/addon-mdx-gfm')
    ],
    framework: {
        name: getAbsolutePath('@storybook/react-webpack5'),
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
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
