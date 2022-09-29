import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JsonEditor } from './components/jsoneditor';
import { data, schema } from './data/features';
import './styles.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Demo',
    // component: CashflowChart,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        // arg types are automatically retrieved, we add only adjustments here
        barChartForecastOpacity: {
            control: { type: 'range', min: 0, max: 1, step: 0.05 }
        },
        barChartHindsightOpacity: {
            control: { type: 'range', min: 0, max: 1, step: 0.05 }
        }
    }
}; // as ComponentMeta<typeof CashflowChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args) => (
    <div style={{ height: 400 }}>
        <JsonEditor schema={schema} data={data} onChange={() => console.log('change')} />
    </div>
);

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const BasicFeatures = Template.bind({});
// CashflowPortfolio.args = {
//     data: cashflowPorfolioData,
//     barChartForecastOpacity: 0.8,
//     barChartHindsightOpacity: 0.4
// };
