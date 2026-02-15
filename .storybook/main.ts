// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import type { StorybookConfig } from '@storybook/react-vite';
import path, { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const config: StorybookConfig = {
    stories: [
        '../docs/src/Introduction.mdx',
        '../docs/src/**/*.mdx',
        '../packages/*/src/**/*.mdx',
        '../packages/*/src/**/*.stories.tsx',
        '../docs/src/**/*.stories.tsx'
    ],

    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-docs')
    ],

    framework: '@storybook/react-vite',

    viteFinal: async (config) => {
        // Configure path aliases
        config.resolve = config.resolve ?? {};
        config.resolve.alias = {
            ...(config.resolve.alias ?? {}),
            '@sagold/react-json-editor': getPackagePath('react-json-editor', 'src'),
            'headless-json-editor': getPackagePath('headless-json-editor', 'src'),
            '@sagold/rje-code-widgets': getPackagePath('rje-code-widgets', 'src'),
            '@sagold/rje-mantine-widgets': getPackagePath('rje-mantine-widgets', 'src')
        };

        // Vite automatically uses sass-embedded if installed
        // No additional SCSS configuration needed

        // Suppress "use client" directive warnings from Mantine
        config.build = config.build ?? {};
        config.build.rollupOptions = config.build.rollupOptions ?? {};
        config.build.rollupOptions.onwarn = (warning, warn) => {
            // Ignore "use client" directive warnings
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
                return;
            }
            warn(warning);
        };

        return config;
    },

    docs: {},

    typescript: {
        reactDocgen: 'react-docgen-typescript'
    }
};

function getPackagePath(...folders: string[]) {
    return path.resolve(__dirname, '..', 'packages', ...folders);
}

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
    return dirname(require.resolve(join(value, 'package.json')));
}

export default config;
