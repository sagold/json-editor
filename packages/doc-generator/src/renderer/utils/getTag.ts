export const getTag = (tags?: { tag: string; name: string; comment: string }[], type?: string, name?: string) =>
    tags?.find((tag) => tag.tag === type && (name == null || tag.name === name));
