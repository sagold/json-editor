export function ReferenceDetails({ title, children }) {
    return (
        <details>
            <summary>
                <code>{title}</code>
            </summary>
            {children}
        </details>
    );
}
