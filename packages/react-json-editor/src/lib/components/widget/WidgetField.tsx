import { CSSProperties, ReactNode, forwardRef, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import { Node, DefaultNodeOptions, isParentNode, JsonError, isJsonError } from 'headless-json-editor';
import { WidgetError } from './WidgetError';
import { WidgetDescription } from './WidgetDescription';

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
};

type WidgetFieldComponent = ForwardRefExoticComponent<
    PropsWithoutRef<WidgetFieldProps> & RefAttributes<HTMLDivElement>
> & {
    Header: typeof WidgetFieldHeader;
    Error: typeof WidgetError;
    Description: typeof WidgetDescription;
    Bar: typeof WidgetFieldBar;
};

/**
 * container for root of a widget
 */
export const WidgetField = forwardRef<HTMLDivElement, WidgetFieldProps>(function WidgetField(
    { widgetType, node, options, children, additionalError, showDescription, showError, className, style },
    ref
) {
    const parentNode = isParentNode(node);
    const schemaType = node.schema.type;
    const hasError = node.errors.length > 0 || isJsonError(additionalError);
    const { disabled = false } = options;
    const classNames = [
        'rje-field',
        `rje-field--${parentNode ? 'parent' : 'value'}`,
        `rje-field--${schemaType}`,
        `rje-field--${widgetType}`,
        disabled ? 'rje-field--disabled' : 'rje-field--enabled',
        hasError ? ' rje-field--error' : 'rje-field--valid',
        className ?? '',
        ...(options.classNames ?? [])
    ];
    return (
        <div className={classNames.join(' ')} data-type={schemaType} data-id={node.pointer} style={style} ref={ref}>
            {children}
            {showError !== false && <WidgetError errors={additionalError ? [additionalError] : node.errors} />}
            {showDescription !== false && <WidgetDescription>{options.description}</WidgetDescription>}
        </div>
    );
}) as WidgetFieldComponent;

WidgetField.Header = WidgetFieldHeader;
WidgetField.Error = WidgetError;
WidgetField.Description = WidgetDescription;
WidgetField.Bar = WidgetFieldBar;

export type WidgetFieldHeaderProps = {
    children?: ReactNode | ReactNode[] | null;
};

function WidgetFieldHeader({ children }: WidgetFieldHeaderProps) {
    if (children == null) {
        return null;
    }
    return <div className="rje-field__header">{children}</div>;
}

export type WidgetFieldBarProps = {};
function WidgetFieldBar({ children }: { children?: ReactNode }) {
    return (
        <div className="rje-header__bar" style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            {children}
        </div>
    );
}
