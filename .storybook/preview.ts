import '@mantine/core/styles.css';
import './storybook.scss';
import '../packages/rje-mantine-widgets/src/index.scss';
import { widgets } from '@sagold/rje-mantine-widgets';
import { setDefaultWidgets } from '@sagold/react-json-editor';
setDefaultWidgets(widgets);

const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/
            }
        }
        // docs: {
        //     theme
        // }
    }
};

export default preview;
