import { Markdown } from '@sagold/react-json-editor';

export type DescriptionProps = {
    text?: string;
    hide?: boolean;
};

export function Description({ text, hide }: DescriptionProps) {
    if (hide || text == null || text.length === 0) {
        return null;
    }
    return <Markdown>{text}</Markdown>;
}
