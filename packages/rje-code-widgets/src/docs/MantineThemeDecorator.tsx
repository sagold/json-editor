import { MantineProvider } from '@mantine/core';

export function MantineThemeDecorator(Story) {
    return (
        <MantineProvider>
            <div className="rje-form">
                <Story />
            </div>
        </MantineProvider>
    );
}
