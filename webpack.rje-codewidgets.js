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
        // Case matters here
        '@sagold/react-json-editor': 'reactJsonEditor',
        'headless-json-editor': 'headlessJsonEditor',
        'json-schema-library': 'jsonSchemaLibrary',
        react: 'react',
        'react-dom': 'reactDOM',
        'semantic-ui-react': 'semanticUIReact'
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'packages', PACKAGE_NAME, 'node_modules')
        ],
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
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
