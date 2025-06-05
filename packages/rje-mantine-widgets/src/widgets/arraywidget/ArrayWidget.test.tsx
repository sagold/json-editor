import { ArrayNode, Editor } from '@sagold/react-json-editor';
import { ArrayWidget } from './ArrayWidget';
import { widgets } from '../../index';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { draft07, draft2019, draft2020, extendDraft, oneOfFuzzyKeyword } from 'json-schema-library';

const drafts = [draft07, draft2019, draft2020].map((draft) =>
    extendDraft(draft, {
        keywords: [oneOfFuzzyKeyword]
    })
);

describe('ArrayWidget (draft-2019-09)', () => {
    let editor: Editor;
    beforeEach(
        () =>
            (editor = new Editor({
                drafts,
                widgets,
                schema: {
                    $schema: 'draft-2019-09',
                    type: 'array',
                    items: [
                        {
                            title: 'title-label',
                            type: 'string',
                            default: 'default title'
                        },
                        {
                            title: 'description-label',
                            type: 'string',
                            default: 'default description'
                        }
                    ]
                }
            }))
    );

    it('should run draft-2019-09', () => {
        expect(editor.root.schemaNode.getDraftVersion()).toEqual('draft-2019-09');
    });

    it('should have rendered minItems', () => {
        render(
            <MantineProvider>
                <ArrayWidget editor={editor} node={editor.getNode() as ArrayNode} />
            </MantineProvider>
        );

        const $title = screen.getByText('title-label');
        expect($title).toBeInTheDocument();

        const $description = screen.getByText('description-label');
        expect($description).toBeInTheDocument();
    });

    it('should have add-options disabled', () => {
        render(
            <MantineProvider>
                <ArrayWidget editor={editor} node={editor.getNode() as ArrayNode} />
            </MantineProvider>
        );

        const $menu = screen.getByRole('button', { name: 'array-menu' });
        expect($menu).toBeInTheDocument();
        expect($menu).toBeDisabled();
    });
});

describe('ArrayWidget (draft-2020-12)', () => {
    let editor: Editor;
    beforeEach(
        () =>
            (editor = new Editor({
                drafts,
                widgets,
                schema: {
                    $schema: 'draft-2020-12',
                    type: 'array',
                    prefixItems: [
                        {
                            title: 'title-label',
                            type: 'string',
                            default: 'default title'
                        },
                        {
                            title: 'description-label',
                            type: 'string',
                            default: 'default description'
                        }
                    ]
                }
            }))
    );

    it('should run draft-2020-12', () => {
        expect(editor.root.schemaNode.getDraftVersion()).toEqual('draft-2020-12');
    });

    it('should have rendered minItems', () => {
        render(
            <MantineProvider>
                <ArrayWidget editor={editor} node={editor.getNode() as ArrayNode} />
            </MantineProvider>
        );

        const $title = screen.getByText('title-label');
        expect($title).toBeInTheDocument();

        const $description = screen.getByText('description-label');
        expect($description).toBeInTheDocument();
    });

    it('should have add-options disabled', () => {
        render(
            <MantineProvider>
                <ArrayWidget editor={editor} node={editor.getNode() as ArrayNode} />
            </MantineProvider>
        );

        const $menu = screen.getByRole('button', { name: 'array-menu' });
        expect($menu).toBeInTheDocument();
        expect($menu).toBeDisabled();
    });
});
