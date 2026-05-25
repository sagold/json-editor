/** returns a flat list of strings, removing nested arrays */
export function flat(list: (string | string[])[]) {
    if (list == null) {
        return [];
    }
    const result: string[] = [];
    list.forEach((item) => {
        if (Array.isArray(item)) {
            result.push(...flat(item));
            return;
        }
        result.push(item);
    });
    return result;
}
