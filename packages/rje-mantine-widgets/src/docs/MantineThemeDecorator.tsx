import { MantineProvider } from '@mantine/core';

export function MantineThemeDecorator(Story) {
    return (
        <MantineProvider>
            <Story />
        </MantineProvider>
    );
}
