import { Editor, ValueNode } from '@sagold/react-json-editor';
import { DateWidget } from './DateWidget';
import userEvent from '@testing-library/user-event';
import { widgets } from '../../index';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

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
        const testDate = '2026-02-22T15:00:00.000Z';
        editor.setData(testDate);
        render(
            <MantineProvider>
                <DateWidget editor={editor} node={editor.getNode() as ValueNode} />
            </MantineProvider>
        );
        const $button = screen.getByRole('button');
        expect($button).toHaveClass('mantine-Input-input');
        // Calculate offset for the specific test date to handle DST correctly
        const localTimeOffset = new Date(testDate).getTimezoneOffset() / 60;
        expect($button).toHaveTextContent(`22 Feb 2026 ${15 - localTimeOffset}:00`);
    });

    it('should correctly update formatted date', async () => {
        const testDate = '2026-02-22T15:00:00.000Z';
        editor.setData(testDate);
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
        // Calculate offset for the specific test date to handle DST correctly
        const localTimeOffset = new Date(testDate).getTimezoneOffset() / 60;
        expect(datetime).toBe(`2026-02-22T${12 + localTimeOffset}:00:00.000Z`);

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
