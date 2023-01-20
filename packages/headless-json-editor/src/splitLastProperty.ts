import { join, split } from '@sagold/json-pointer';

export function splitLastProperty(pointer: string): [string, string] {
    const frags = split(pointer);
    if (frags.length >= 1) {
        const last = frags.pop() as string;
        return [join(frags), last];
    }
    throw new Error(`There is no property for pointer '${pointer}'`);
}
