import { Decorator } from '@storybook/react';
import theme from '../theme';

export const ThemeDecorator: Decorator = (Story) => (
    <div className="rje-theme-decorator rje-form rje-theme" style={theme}>
        <div className="rje-theme--light">
            <div className="story-columns">
                <Story />
            </div>
        </div>
        <div className="rje-theme--dark">
            <div className="story-columns">
                <Story />
            </div>
        </div>
    </div>
);
