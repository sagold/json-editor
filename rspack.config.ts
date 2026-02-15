import path, { dirname as dir } from 'node:path';
import fs from 'node:fs';
import TerserPlugin from 'terser-webpack-plugin';
import type { Configuration } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { fileURLToPath } from 'node:url';
import sassEmbedded from 'sass-embedded';

// @ts-ignore
const __dirname = dir(fileURLToPath(import.meta.url));

const PRODUCTION = process.env.NODE_ENV === 'production';
const PACKAGE_NAME = process.env.PACKAGE_NAME as string;
const PACKAGE_PATH = path.resolve(__dirname, `./packages/${PACKAGE_NAME}`);

const config: Configuration = {
    plugins: [new rspack.ProgressPlugin({})],
    watch: !PRODUCTION,
    context: path.join(__dirname),
    entry: getEntryMap(),
    experiments: { css: true },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: { packages: path.resolve(__dirname, 'packages/') },
        modules: [
            path.resolve(__dirname),
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'packages', PACKAGE_NAME, 'node_modules')
        ]
    },
    output: {
        library: dashedToCamelCase(PACKAGE_NAME),
        path: path.resolve(PACKAGE_PATH, 'dist'),
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: `(typeof self !== 'undefined' ? self : this)`
    },
    module: {
        parser: {
            'css/auto': { namedExports: false }
        },
        generator: {
            // CSS https://rspack.dev/config/module#moduleparsercss
            // Generator options for asset modules
            asset: {},
            // Generator options for asset/inline modules
            'asset/inline': {}
        },
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                exclude: /[\\/]node_modules[\\/]/,
                use: [
                    {
                        loader: 'builtin:swc-loader',
                        options: {
                            sourceMap: true,
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true
                                },
                                transform: {
                                    react: {
                                        runtime: 'automatic',
                                        development: !PRODUCTION,
                                        refresh: !PRODUCTION
                                    }
                                }
                            },
                            env: {
                                targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14']
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    {
                        loader: 'sass-loader',
                        options: {
                            // using `modern-compiler` and `sass-embedded` together significantly improve build performance,
                            // requires `sass-loader >= 14.2.1`
                            api: 'modern-compiler',
                            implementation: sassEmbedded
                        }
                    }
                ],
                // set to 'css/auto' if you want to support '*.module.(scss|sass)' as CSS Modules, otherwise set type to 'css'
                type: 'css/auto'
            }
        ]
    },
    optimization: { minimizer: [new TerserPlugin()] },
    externals: {
        '@sagold/rje-mantine-widgets': {
            commonjs: '@sagold/rje-mantine-widgets',
            commonjs2: '@sagold/rje-mantine-widgets',
            amd: '@sagold/rje-mantine-widgets',
            root: 'rjeMantineWidgets'
        },
        '@sagold/react-json-editor': {
            commonjs: '@sagold/react-json-editor',
            commonjs2: '@sagold/react-json-editor',
            amd: '@sagold/react-json-editor',
            root: 'reactJsonEditor'
        },
        'headless-json-editor': {
            commonjs: 'headless-json-editor',
            commonjs2: 'headless-json-editor',
            amd: 'headless-json-editor',
            root: 'headlessJsonEditor'
        },
        'json-schema-library': {
            commonjs: 'json-schema-library',
            commonjs2: 'json-schema-library',
            amd: 'json-schema-library',
            root: 'jlib'
        },
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React'
        },
        'react-dom/client': {
            commonjs: 'react-dom/client',
            commonjs2: 'react-dom/client',
            amd: 'react-dom/client',
            root: 'ReactDOM'
        },
        '@mantine/core': {
            commonjs: '@mantine/core',
            commonjs2: '@mantine/core',
            amd: '@mantine/core',
            root: ''
        },
        '@mantine/hooks': {
            commonjs: '@mantine/hooks',
            commonjs2: '@mantine/hooks',
            amd: '@mantine/hooks',
            root: ''
        },
        '@mantine/dates': {
            commonjs: '@mantine/dates',
            commonjs2: '@mantine/dates',
            amd: '@mantine/dates',
            root: ''
        }
    }
};

function getEntryMap() {
    const entry: Record<string, string> = {};
    const projectJsonFile = path.resolve(__dirname, `./packages/${PACKAGE_NAME}/project.json`);
    const project = JSON.parse(fs.readFileSync(projectJsonFile, 'utf-8'));
    Object.keys(project.entry).forEach(
        (id) => (entry[id] = path.resolve(__dirname, `./packages/${PACKAGE_NAME}`, project.entry[id]))
    );
    entry[dashedToCamelCase(PACKAGE_NAME)] = entry['main'];
    delete entry.main;
    return entry;
}

function dashedToCamelCase(v: string) {
    return v.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

export default config;
