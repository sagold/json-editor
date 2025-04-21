import { Editor, ValueNode } from '@sagold/react-json-editor';
import { OneOfSelectWidget } from './OneOfSelectWidget';
import userEvent from '@testing-library/user-event';
import { widgets } from '../../index';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

describe('OneOfSelectWidget', () => {
    let editor: Editor;
    beforeEach(
        () =>
            (editor = new Editor({
                widgets,
                schema: {
                    oneOf: [
                        {
                            title: 'First-OneOf',
                            type: 'object',
                            required: ['title'],
                            properties: { title: { type: 'string' } }
                        },
                        {
                            title: 'Second-OneOf',
                            type: 'object',
                            required: ['subtitle'],
                            properties: { subtitle: { type: 'string' } }
                        }
                    ]
                }
            }))
    );

    it('should have first oneOf-item selected initially', () => {
        editor.setData({ title: 'test-title' });
        render(
            <MantineProvider>
                <OneOfSelectWidget editor={editor} node={editor.getNode() as ValueNode} />
            </MantineProvider>
        );
        const $select = screen.getByRole('select');
        expect($select).toHaveValue('First-OneOf');
    });

    it('should have second oneOf-item selected initially', () => {
        editor.setData({ subtitle: 'test-title' });
        render(
            <MantineProvider>
                <OneOfSelectWidget editor={editor} node={editor.getNode() as ValueNode} />
            </MantineProvider>
        );
        const $select = screen.getByRole('select');
        expect($select).toHaveValue('Second-OneOf');
    });

    it('should select second item', async () => {
        editor.setData({ title: 'test-title' });
        const { rerender } = render(
            <MantineProvider>
                <OneOfSelectWidget editor={editor} node={editor.getNode() as ValueNode} />
            </MantineProvider>
        );

        const user = userEvent.setup();
        await user.click(screen.getByRole('select'));
        await user.click(screen.getByText('Second-OneOf'));

        rerender(
            <MantineProvider>
                <OneOfSelectWidget editor={editor} node={editor.getNode() as ValueNode} />
            </MantineProvider>
        );
        const $select = screen.getByRole('select');
        expect($select).toHaveValue('Second-OneOf');
    });
});
