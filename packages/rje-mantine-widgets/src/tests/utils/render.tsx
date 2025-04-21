import * as React from 'react';
import { RenderOptions, render as _render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

export const render = (Component: React.ReactNode, options?: RenderOptions) =>
    _render(<MantineProvider>{Component}</MantineProvider>, options);
