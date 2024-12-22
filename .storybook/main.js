import path, { dirname, join } from 'path';

module.exports = {
    stories: [
        '../docs/src/Introduction.mdx',
        '../docs/src/**/*.mdx',
        '../packages/*/src/**/*.mdx',
        '../packages/*/src/**/*.stories.tsx',
        '../docs/src/**/*.stories.tsx'
    ],

    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/addon-mdx-gfm'),
        getAbsolutePath('@storybook/addon-webpack5-compiler-swc')
    ],

    framework: {
        name: getAbsolutePath('@storybook/react-webpack5'),
        options: {
            builder: {
                useSWC: true
            }
        }
    },
    swc: () => ({
        jsc: {
            transform: {
                react: {
                    runtime: 'automatic'
                }
            }
        }
    }),

    webpackFinal: async (config, { configType }) => {
        config.resolve.alias = {
            ...(config.resolve.alias ?? {}),
            '@sagold/react-json-editor': getPackagePath('react-json-editor', 'src'),
            'headless-json-editor': getPackagePath('headless-json-editor', 'src'),
            '@sagold/rje-aria-widgets': getPackagePath('rje-aria-widgets', 'src'),
            '@sagold/rje-code-widgets': getPackagePath('rje-code-widgets', 'src'),
            '@sagold/rje-mantine-widgets': getPackagePath('rje-mantine-widgets', 'src')
        };

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
                        sourceMap: true,
                        sassOptions: {
                            api: 'modern-compiler',
                            implementation: require.resolve('sass-embedded')
                            // includePaths: ['node_modules', ...((sassLoader.options && sassLoader.options.sassOptions && sassLoader.options.sassOptions.includePaths) || [])],
                        }
                    }
                }
            ]
        });
        return config;
    },

    docs: {},

    typescript: {
        reactDocgen: 'react-docgen-typescript'
    }
};

function getPackagePath(...folders) {
    return path.resolve(__dirname, '..', 'packages', ...folders);
}

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
