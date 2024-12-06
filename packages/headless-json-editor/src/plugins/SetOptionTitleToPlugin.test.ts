import { HeadlessEditor } from '../HeadlessEditor';
import { JsonSchema } from 'headless-json-editor';
import { SetOptionTitleToPlugin } from './SetOptionTitleToPlugin';
import { strict as assert } from 'assert';

describe('SetOptionTitleToPlugin', () => {
    let schema: JsonSchema;
    beforeEach(() => {
        schema = {
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                },
                selection: {
                    type: 'string',
                    enum: ['1', '2'],
                    setOptionTitleTo: '#/title',
                    options: {
                        enum: ['One', 'Two']
                    }
                }
            }
        };
    });

    it('should update target node on source change', () => {
        const editor = new HeadlessEditor({
            data: {
                title: '',
                selection: '1'
            },
            schema,
            plugins: [SetOptionTitleToPlugin]
        });

        editor.setValue('#/selection', '2');
        assert.equal(editor.getData().title, 'Two');

        editor.setValue('#/selection', '1');
        assert.equal(editor.getData().title, 'One');
    });
});
