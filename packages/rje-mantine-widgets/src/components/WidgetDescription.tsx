import { Markdown } from '@sagold/react-json-editor';

export type WidgetDescriptionProps = {
    text?: string;
    hide?: boolean;
};

export function WidgetDescription({ text, hide }: WidgetDescriptionProps) {
    if (hide || text == null || text.length === 0) {
        return null;
    }
    return <Markdown>{text}</Markdown>;
}
