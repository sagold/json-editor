import { Markdown } from '@storybook/addon-docs/blocks';
import apiData from '../../generated/api/data.json';

export function Api() {
    const content = '## test';
    return <Markdown>{JSON.stringify(apiData.Editor, null, 2)}</Markdown>;
}
