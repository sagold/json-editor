import { strict as assert } from 'assert';
import { HeadlessJsonEditor } from '../../src/HeadlessJsonEditor';
import { JSONSchema } from '../../src/types';

describe('docs', () => {
    it('should log list of strings', () => {
        // import { HeadlessJsonEditor } from 'headless-json-editor';
        const jsonSchema = { type: 'array', items: { type: 'string' } } as JSONSchema;
        const he = new HeadlessJsonEditor({ schema: jsonSchema, data: ['first item'] });
        let rootNode = he.getState();
        rootNode = he.setValue('#/1', 124);
        // console.log(JSON.stringify(rootNode, null, 2));
        // render(rootNode);
    });
});
