const path = require('path'); // eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); // eslint-disable-line
const PRODUCTION = process.env.NODE_ENV === 'production';
const PACKAGE_NAME = 'rje-code-widgets';

const config = {
    entry: `./packages/${PACKAGE_NAME}/src/index.ts`,
    mode: PRODUCTION ? 'production' : 'development',
    context: path.join(__dirname),
    // target: "web",
    devtool: PRODUCTION ? false : 'source-map',
    stats: { children: false },
    output: {
        path: path.resolve(__dirname, 'packages', PACKAGE_NAME, PRODUCTION ? 'dist' : 'dev'),
        filename: `rjeCodeWidgets${PRODUCTION ? '.min' : ''}.js`,
        libraryTarget: 'umd',
        library: 'rje-codeWidets',
        umdNamedDefine: true,
        globalObject: `(typeof self !== 'undefined' ? self : this)`
    },
    externals: {
        '@sagold/react-json-editor': {
            commonjs: '@sagold/react-json-editor',
            commonjs2: '@sagold/react-json-editor',
            amd: '@sagold/react-json-editor',
            root: 'rje'
        },
        'headless-json-editor': {
            commonjs: 'headless-json-editor',
            commonjs2: 'headless-json-editor',
            amd: 'headless-json-editor',
            root: 'hje'
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
        'semantic-ui-react': {
            commonjs: 'semantic-ui-react',
            commonjs2: 'semantic-ui-react',
            amd: 'semantic-ui-react',
            root: 'semanticUIReact'
        }
        // '@codemirror/state': {
        //     commonjs: '@codemirror/state',
        //     commonjs2: '@codemirror/state',
        //     amd: '@codemirror/state',
        //     root: 'codeMirrorState' // dummy
        // }
        // '@codemirror/view': {
        //     commonjs: '@codemirror/view',
        //     commonjs2: '@codemirror/view',
        //     amd: '@codemirror/view',
        //     root: 'codeMirrorView' // dummy
        // },
        // '@codemirror/lang-json': {
        //     commonjs: '@codemirror/lang-json',
        //     commonjs2: '@codemirror/lang-json',
        //     amd: '@codemirror/lang-json',
        //     root: 'codeMirrorLangJson' // dummy
        // },
        // '@codemirror/lint': {
        //     commonjs: '@codemirror/lint',
        //     commonjs2: '@codemirror/lint',
        //     amd: '@codemirror/lint',
        //     root: 'codeMirrorLint' // dummy
        // },
        // '@codemirror/language': {
        //     commonjs: '@codemirror/language',
        //     commonjs2: '@codemirror/language',
        //     amd: '@codemirror/language',
        //     root: 'codeMirrorLanguage' // dummy
        // },
        // '@codemirror/autocomplete': {
        //     commonjs: '@codemirror/autocomplete',
        //     commonjs2: '@codemirror/autocomplete',
        //     amd: '@codemirror/autocomplete',
        //     root: 'codeMirrorAutocomplete' // dummy
        // },
        // '@uiw/react-codemirror': {
        //     commonjs: '@uiw/react-codemirror',
        //     commonjs2: '@uiw/react-codemirror',
        //     amd: '@uiw/react-codemirror',
        //     root: 'reactCodeMirror' // dummy
        // }
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
                        compilerOptions: {
                            sourceMap: !PRODUCTION,
                            declaration: PRODUCTION
                        }
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    // isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[hash:hex]',
                                mode: 'local'
                            },
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
            }
        ]
    },

    optimization: {
        minimizer: [new TerserPlugin()]
    }
};

module.exports = config;
