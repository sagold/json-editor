import eslint from '@eslint/js';
import globals from 'globals';
// import importPlugin from 'eslint-plugin-import';
import nounsanitized from 'eslint-plugin-no-unsanitized';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['node_modules', '/images', '/docs', '**/dist/**', '/tools', 'webpack.config.js']),
    {
        files: [
            './packages/*/src/**/*.ts',
            './packages/*/src/**/*.tsx',
            './packages/*/tests/**/*.ts',
            './packages/*/tests/**/*.tsx',
            './docs/**/*.tsx'
        ],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            nounsanitized.configs.recommended,
            // importPlugin.flatConfigs.recommended,
            react.configs.flat.recommended,
            react.configs.flat['jsx-runtime'],
            reactHooks.configs.flat.recommended
        ],
        rules: {
            'import/no-named-as-default-member': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }]
        },
        settings: {
            react: {
                // React version. "detect" automatically picks the version you have installed.
                // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                // Defaults to the "defaultVersion" setting and warns if missing, and to "detect" in the future
                version: '19.2'
            }
        },
        languageOptions: {
            globals: {
                __DEVELOPMENT__: true,
                ...globals.browser
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        }
    }
]);
