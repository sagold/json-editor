import { Editor, ValueNode } from '@sagold/react-json-editor';
import { DateWidget } from './DateWidget';
import userEvent from '@testing-library/user-event';
import { widgets } from '../../index';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

const LOCAL_TIME_OFFST = new Date().getTimezoneOffset() / 60;

describe('DateWidget', () => {
    let editor: Editor;
    beforeEach(
        () =>
            (editor = new Editor({
                widgets,
                schema: {
                    type: 'string',
                    format: 'date-time'
                }
            }))
    );

    it('should show correctly formatted date ', () => {
        editor.setData('2026-02-22T15:00:00.000Z');
        render(
            <MantineProvider>
                <DateWidget editor={editor} node={editor.getNode() as ValueNode} />
            </MantineProvider>
        );
        const $button = screen.getByRole('button');
        expect($button).toHaveClass('mantine-Input-input');
        // NOTE this will fail for local offset not by full hour
        expect($button).toHaveTextContent(`22 Feb 2026 ${15 - LOCAL_TIME_OFFST}:00`);
    });

    it('should correctly update formatted date', async () => {
        editor.setData('2026-02-22T15:00:00.000Z');
        const { container, rerender } = render(
            <MantineProvider env="test">
                <DateWidget editor={editor} node={editor.getNode() as ValueNode} />
            </MantineProvider>
        );

        const user = userEvent.setup();
        await user.click(screen.getByRole('button')); // click input and open modal
        const $hours = screen.getByRole('spinbutton', { value: { max: 23 } });
        await user.click($hours); // click hours input
        await user.keyboard('12'); // change hours to 12
        const submitButton = container.querySelector('.mantine-DateTimePicker-submitButton');
        await user.click(submitButton!); // confirm input and close modal

        // check if data was correctly updated
        const datetime = editor.getData();
        expect(datetime).toBe(`2026-02-22T${12 + LOCAL_TIME_OFFST}:00:00.000Z`);

        rerender(
            <MantineProvider env="test">
                <DateWidget editor={editor} node={editor.getNode() as ValueNode} />
            </MantineProvider>
        );

        // check if data was correctly updated for display
        const $button = screen.getByRole('button'); // note: fails when modal is not closed
        expect($button).toHaveClass('mantine-Input-input');
        expect($button).toHaveTextContent(`22 Feb 2026 12:00`);
    });
});
