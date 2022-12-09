import { join, split } from 'gson-pointer';
export function splitLastProperty(pointer) {
    const frags = split(pointer);
    if (frags.length >= 1) {
        const last = frags.pop();
        return [join(frags), last];
    }
    throw new Error(`There is no property for pointer '${pointer}'`);
}
//# sourceMappingURL=splitLastProperty.js.map