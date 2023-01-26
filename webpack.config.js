const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PRODUCTION = process.env.NODE_ENV === 'production';
const PACKAGE_NAME = process.env.PACKAGE_NAME;

const dashedToCamelCase = (v) =>
    v.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });

const entry = { main: `./packages/${PACKAGE_NAME}/src/index.ts` };
if (fs.existsSync(path.resolve(__dirname, `./packages/${PACKAGE_NAME}/src/index.scss`))) {
    entry['styles'] = `./packages/${PACKAGE_NAME}/src/index.scss`;
}

// console.log(
//     `package: ${PACKAGE_NAME} - production: ${PRODUCTION} - ${entry.length === 2 ? 'with styles' : 'no styles'}`
// );

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
            if (entry.runtime === 'styles') {
                return `styles.css`;
            }
            if (entry.runtime === 'main') {
                return `${dashedToCamelCase(PACKAGE_NAME)}${PRODUCTION ? '.min' : ''}.js`;
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
        'semantic-ui-react': {
            commonjs: 'semantic-ui-react',
            commonjs2: 'semantic-ui-react',
            amd: 'semantic-ui-react',
            root: 'semanticUIReact'
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
            {
                test: /\.scss$/,
                use: [
                    PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
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
            }
        ]
    },

    optimization: {
        minimizer: [new TerserPlugin()]
    },
    plugins: PRODUCTION
        ? [
              new MiniCssExtractPlugin({
                  filename: `${PACKAGE_NAME}.css`
              })
          ]
        : []
};

module.exports = config;
