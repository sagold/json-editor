import * as React from 'react';
import '@mantine/core/styles/baseline.css';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/global.css';
import { MantineProvider } from '@mantine/core';

export function MantineThemeDecorator(Story) {
    return (
        <MantineProvider>
            <Story />
        </MantineProvider>
    );
}
