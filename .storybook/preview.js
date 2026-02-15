import '@mantine/core/styles/baseline.css';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/global.css';
import './storybook.scss';
import '../packages/rje-mantine-widgets/src/index.scss';

import { widgets } from '@sagold/rje-mantine-widgets';
import { setDefaultWidgets } from '@sagold/react-json-editor';
setDefaultWidgets(widgets);

export const parameters = {
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        }
    }
};
