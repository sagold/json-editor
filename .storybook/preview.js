import '../packages/rje-widgets/src/index.scss';
import './storybook.scss';

import widgets from '@sagold/rje-widgets';
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
