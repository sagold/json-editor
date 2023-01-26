import 'semantic-ui-css/semantic.min.css';
import '../packages/react-json-editor/src/index.scss';
import '../packages/rje-widgets/src/index.scss';
import './storybook.css';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        }
    }
};
