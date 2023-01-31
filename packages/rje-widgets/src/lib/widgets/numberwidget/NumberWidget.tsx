import { NumberNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { WidgetPlugin } from '@sagold/react-json-editor';
import { Form, SemanticICONS, Input, Label, SemanticShorthandItem, LabelProps } from 'semantic-ui-react';
import { widget } from '@sagold/react-json-editor';
import { useCallback, useState, useMemo } from 'react';

type NumberOptions = {
    icon?: SemanticICONS;
    iconPosition?: 'left';
    inline?: true;
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    label?: SemanticShorthandItem<LabelProps>;
    labelPosition?: 'left' | 'right' | 'right corner' | 'left corner';
} & DefaultNodeOptions;

export const NumberWidget = widget<NumberNode<NumberOptions>, number>(({ node, options, setValue }) => {
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
    useMemo(() => {
        if (inputRef) {
            // @ts-ignore
            inputRef.value = node.value;
        }
    }, [node.value]);

    const attributes: Record<string, unknown> = {};
    if (options.icon) {
        attributes.icon = options.icon;
        if (options.iconPosition) {
            attributes.iconPosition = options.iconPosition;
        }
    }
    if (options.label) {
        attributes.label = options.label;
        if (options.labelPosition) {
            attributes.labelPosition = options.labelPosition;
        }
    }

    const onChange = useCallback(
        (event: Event | React.ChangeEvent<HTMLInputElement>) => {
            const input = event.target as HTMLInputElement;
            const number = parseFloat(input.value);
            if (`${number}` === input.value) {
                setValue(number);
            } else {
                // @todo TYPE CHANGE BREAKS EVERYTHING
                // should not change node type - should maintain expected type from schema
                // @ts-ignore
                setValue(input.value);
            }
        },
        [setValue]
    );

    const changeListener = {
        [options.liveUpdate ? 'onChange' : 'onBlur']: onChange
    };

    return (
        <div className="rje-form rje-value" data-type="number" data-id={node.pointer}>
            <Form.Field
                id={node.id}
                inline={options.inline === true}
                disabled={options.disabled === true}
                required={options.required === true}
                error={node.errors.length > 0}
            >
                <label htmlFor={node.id}>{options.title}</label>
                <Input
                    ref={(ref) => {
                        const input = ref as unknown as { inputRef: { current: HTMLInputElement | null } };
                        setInputRef(input?.inputRef?.current);
                    }}
                    id={node.id}
                    type="number"
                    disabled={options.disabled === true}
                    placeholder={options.placeholder}
                    readOnly={options.readOnly === true}
                    defaultValue={node.value}
                    required={options.required === true}
                    {...attributes}
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

export const NumberWidgetPlugin: WidgetPlugin = {
    id: 'number-widget',
    use: (node) => node.schema.type === 'number',
    Widget: NumberWidget
};
