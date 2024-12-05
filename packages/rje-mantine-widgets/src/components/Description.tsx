import { Markdown } from '@sagold/react-json-editor';

export type DescriptionProps = {
    text?: string;
};

export function Description({ text }: WidgetDescriptionProps) {
    if (text == null || text.length === 0) {
        return null;
    }
    return <Markdown>{text}</Markdown>;
}
