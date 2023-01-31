import { StringNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { Form, Label } from 'semantic-ui-react';
import { widget, WidgetPlugin } from '@sagold/react-json-editor';
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useMemo } from 'react';

export type TextWidgetOptions = {
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
} & DefaultNodeOptions;

export const TextWidget = widget<StringNode<TextWidgetOptions>, string>(({ node, options, setValue }) => {
    const [inputRef, setInputRef] = useState<HTMLTextAreaElement | null>(null);
    useMemo(() => {
        if (inputRef) {
            inputRef.value = node.value ?? '';
        }
    }, [node.value]);

    const isValidConst = node.schema.const != null && node.errors.length === 0;
    const disabled = options.disabled || isValidConst;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value || '');
    const changeListener = {
        [options.liveUpdate ? 'onChange' : 'onBlur']: onChange
    };

    return (
        <div
            className={`rje-form rje-value ${disabled ? 'disabled' : 'enabled'}`}
            data-type="string"
            data-id={node.pointer}
        >
            <Form.Field disabled={options.disabled} required={options.required === true} error={node.errors.length > 0}>
                <label htmlFor={node.id}>{options.title}</label>
                <TextareaAutosize
                    ref={setInputRef}
                    disabled={options.disabled}
                    id={node.id}
                    rows={1}
                    required={options.required === true}
                    readOnly={options.readOnly === true}
                    minRows={2}
                    maxRows={10}
                    cacheMeasurements
                    defaultValue={node.value}
                    {...changeListener}
                />
                {node.errors.length > 0 && (
                    <Label color="red" basic prompt pointing="above">
                        {node.errors.map((e) => e.message).join(';')}
                    </Label>
                )}
            </Form.Field>
            {options.description && <em className="rje-description">{options.description}</em>}
        </div>
    );
});

export const TextWidgetPlugin: WidgetPlugin = {
    id: 'text-widget',
    use: (node) =>
        node.schema.type === 'string' && (node.schema.format === 'html' || node.schema.format === 'textarea'),
    Widget: TextWidget
};
