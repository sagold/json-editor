const path = require('path'); // eslint-disable-line
const TerserPlugin = require('terser-webpack-plugin'); // eslint-disable-line
const PRODUCTION = process.env.NODE_ENV === 'production';
const PACKAGE_NAME = 'headless-json-editor';

const dashedToCamelCase = (v) =>
    v.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });

const config = {
    entry: `./packages/${PACKAGE_NAME}/src/index.ts`,
    mode: PRODUCTION ? 'production' : 'development',
    context: path.join(__dirname),
    // target: "web",
    devtool: PRODUCTION ? false : 'source-map',
    stats: { children: false },
    output: {
        path: path.resolve(__dirname, 'packages', PACKAGE_NAME, PRODUCTION ? 'dist' : 'dev'),
        filename: `${dashedToCamelCase(PACKAGE_NAME)}${PRODUCTION ? '.min' : ''}.js`,
        libraryTarget: 'umd',
        library: dashedToCamelCase(PACKAGE_NAME),
        umdNamedDefine: true,
        globalObject: `(typeof self !== 'undefined' ? self : this)`
    },
    externals: {
        'json-schema-library': {
            commonjs: 'json-schema-library',
            commonjs2: 'json-schema-library',
            amd: 'json-schema-library',
            root: 'jlib'
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
                        compilerOptions: {
                            sourceMap: !PRODUCTION,
                            declaration: PRODUCTION
                        }
                    }
                }
            }
        ]
    },

    optimization: {
        minimizer: [new TerserPlugin()]
    }
};

module.exports = config;
