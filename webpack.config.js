/* global __dirname, process */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PRODUCTION = process.env.NODE_ENV === 'production';
const PACKAGE_NAME = process.env.PACKAGE_NAME;
const project = require(path.resolve(__dirname, `./packages/${PACKAGE_NAME}/project.json`));

const dashedToCamelCase = (v) =>
    v.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });

const entry = {};
Object.keys(project.entry).forEach(
    (id) => (entry[id] = path.resolve(__dirname, `./packages/${PACKAGE_NAME}`, project.entry[id]))
);

const config = {
    entry,
    mode: PRODUCTION ? 'production' : 'development',
    context: path.join(__dirname),
    // target: "web",
    devtool: PRODUCTION ? false : 'source-map',
    stats: { children: false },
    output: {
        path: path.resolve(__dirname, 'packages', PACKAGE_NAME, PRODUCTION ? 'dist' : 'dev'),
        filename: (entry) => {
            if (entry.runtime === 'main') {
                return `${dashedToCamelCase(PACKAGE_NAME)}${PRODUCTION ? '.min' : ''}.js`;
            }
            // simple check to ignore any css files, as they have been extracted by cssminify
            // and this is only the webpack shell
            if (entry.chunk.files.has(`${entry.chunk.name}.css`)) {
                return `ignore/${entry.chunk.name}`;
            }
        },
        libraryTarget: 'umd',
        library: dashedToCamelCase(PACKAGE_NAME),
        umdNamedDefine: true,
        globalObject: `(typeof self !== 'undefined' ? self : this)`
    },
    externals: {
        '@sagold/rje-widgets': {
            commonjs: '@sagold/rje-widgets',
            commonjs2: '@sagold/rje-widgets',
            amd: '@sagold/rje-widgets',
            root: 'rjeWidgets'
        },
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
    },
    resolve: {
        modules: [
            path.resolve(__dirname),
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'packages', PACKAGE_NAME, 'node_modules')
        ],
        alias: {
            packages: path.resolve(__dirname, 'packages/')
        },
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        projectReferences: true,
                        configFile: path.resolve(__dirname, 'packages', PACKAGE_NAME, 'tsconfig.json'),
                        // does not yet emit types - note that es6 export includes types
                        compilerOptions: {
                            sourceMap: true,
                            declaration: PRODUCTION
                        },
                        transpileOnly: !PRODUCTION
                    }
                }
            },
            // {
            //     test: /\module\.s?css$/i,
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 sourceMap: true,
            //                 importLoaders: 3,
            //                 modules: {
            //                     localIdentName: '[name]__[local]___[hash:base64:5]' // Adjust as needed
            //                 }
            //             }
            //         },
            //         'resolve-url-loader',
            //         {
            //             loader: 'sass-loader',
            //             options: {
            //                 sourceMap: true,
            //                 sassOptions: { outputStyle: 'compressed' }
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.scss$/,
                use: [
                    PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 3
                        }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: { outputStyle: 'compressed' },
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },

    optimization: {
        minimizer: [new TerserPlugin()]
    },
    plugins: PRODUCTION ? [new MiniCssExtractPlugin()] : []
};

module.exports = config;
