import { CSSProperties, ReactNode, forwardRef, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import { Node, DefaultNodeOptions, isParentNode, JsonError, isJsonError } from 'headless-json-editor';
import { WidgetError } from './WidgetError';
import { WidgetDescription } from './WidgetDescription';
import classNames from 'classnames';

export type WidgetFieldProps = {
    widgetType: string;
    node: Node;
    options: DefaultNodeOptions;
    showDescription?: boolean;
    showError?: boolean;
    additionalError?: JsonError;
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    /* if set, errors will be taken from this list instead of node.errors.
        Example: Display all errors of children in this widget */
    errors?: JsonError[];
};

type WidgetFieldComponent = ForwardRefExoticComponent<
    PropsWithoutRef<WidgetFieldProps> & RefAttributes<HTMLDivElement>
> & {
    Header: typeof WidgetFieldHeader;
    Error: typeof WidgetError;
    Description: typeof WidgetDescription;
};

/**
 * container for root of a widget
 */
export const WidgetField = forwardRef<HTMLDivElement, WidgetFieldProps>(function WidgetField(
    { widgetType, node, options, children, errors, additionalError, showDescription, showError, className, style },
    ref
) {
    const listOfErrors = Array.isArray(errors) ? errors : node.errors;

    const parentNode = isParentNode(node);
    const schemaType = node.schema.type;
    const hasError = listOfErrors.length > 0 || isJsonError(additionalError);
    const { disabled = false } = options;
    return (
        <div
            className={classNames(
                'rje-field',
                `rje-field--${parentNode ? 'parent' : 'value'}`,
                `rje-field--${schemaType}`,
                `rje-field--${widgetType}`,
                disabled ? 'rje-field--disabled' : 'rje-field--enabled',
                hasError ? ' rje-field--error' : 'rje-field--valid',
                className,
                options.classNames
            )}
            data-type={schemaType}
            data-id={node.pointer}
            style={style}
            ref={ref}
        >
            {children}
            {showError !== false && <WidgetError errors={additionalError ? [additionalError] : listOfErrors} />}
            {showDescription !== false && <WidgetDescription>{options.description}</WidgetDescription>}
        </div>
    );
}) as WidgetFieldComponent;

WidgetField.Header = WidgetFieldHeader;
WidgetField.Error = WidgetError;
WidgetField.Description = WidgetDescription;

export type WidgetFieldHeaderProps = {
    children?: ReactNode | ReactNode[] | null;
};

function WidgetFieldHeader({ children }: WidgetFieldHeaderProps) {
    if (children == null) {
        return null;
    }
    return <div className="rje-field__header">{children}</div>;
}
