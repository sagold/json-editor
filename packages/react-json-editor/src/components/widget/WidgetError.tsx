import { JsonError } from 'headless-json-editor';

export type WidgetErrorProps = {
    errors: JsonError[];
};

export function WidgetError({ errors }: WidgetErrorProps) {
    if (errors.length === 0) {
        return null;
    }
    return (
        <div className="rje-error">
            <span className="rje-icon rje-icon--solid rje-icon--error">Report</span>
            {errors.map((e) => e.message).join(';')}
        </div>
    );
}
