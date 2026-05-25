export function maybe(content?: string, test?: any) {
    return arguments.length === 1 ? (content ? content : null) : test ? content : null;
}
