import * as React from 'react';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export function MantineThemeDecorator(Story) {
    return (
        <MantineProvider>
            <Story />
        </MantineProvider>
    );
}
